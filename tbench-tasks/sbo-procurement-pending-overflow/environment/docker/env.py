
import random
from dataclasses import dataclass
from typing import Dict

TANK_CONFIGS = {
    'T1': {'fuel': 'REG_87', 'capacity': 10000, 'drain_avg': 45, 'price': 3.40},
    'T2': {'fuel': 'PREM_93', 'capacity': 8000, 'drain_avg': 22, 'price': 3.90},
    'T3': {'fuel': 'DIESEL', 'capacity': 6000, 'drain_avg': 35, 'price': 4.50},
    'T4': {'fuel': 'REG_87_AUX', 'capacity': 10000, 'drain_avg': 40, 'price': 3.40},
}

@dataclass
class TankState:
    tank_id: str
    current_gal: float
    capacity: float
    level_pct: float
    pending_po_gal: float = 0
    pending_po_eta_hr: int = 0
    inspection_score: int = 90

@dataclass
class GasStationState:
    tanks: Dict[str, TankState]
    hour: int = 0
    day_of_week: int = 0
    total_revenue: float = 0
    total_cost: float = 0
    stockout_count: int = 0
    stockout_gal_lost: float = 0

class GasStationProcurementEnv:
    def __init__(self, seed=42, max_hours=24*30):
        random.seed(seed)
        self.max_hours = max_hours
        self.hour = 0
        self.state = self._initial_state()
        self.gal_options = [0, 1000, 2500, 5000, 7500, 10000]
        self.stockout_penalty = 12.0
        self.holding_cost = 0.001

    def _initial_state(self):
        init_map = {'T1': 3200, 'T2': 6100, 'T3': 1200, 'T4': 8900}
        tanks = {}
        for tid, cfg in TANK_CONFIGS.items():
            cur = init_map.get(tid, cfg['capacity']*0.6)
            tanks[tid] = TankState(tid, cur, cfg['capacity'], cur/cfg['capacity']*100, inspection_score={'T1':92,'T2':85,'T3':68,'T4':95}.get(tid,90))
        return GasStationState(tanks=tanks)

    def _drain(self, tid):
        base = TANK_CONFIGS[tid]['drain_avg']
        dow = 1.3 if self.state.day_of_week in [4,5] else 1.0
        return base * dow * random.uniform(0.8,1.2)

    def step(self, action):
        reward = 0
        traces = []
        for tid, tank in self.state.tanks.items():
            if tank.pending_po_eta_hr > 0:
                tank.pending_po_eta_hr -= 1
                if tank.pending_po_eta_hr <=0 and tank.pending_po_gal>0:
                    tank.current_gal = min(tank.capacity, tank.current_gal + tank.pending_po_gal)
                    tank.pending_po_gal = 0
            drain = self._drain(tid)
            before = tank.current_gal
            if tank.current_gal >= drain:
                tank.current_gal -= drain
                rev = drain * TANK_CONFIGS[tid]['price']
                self.state.total_revenue += rev
                reward += rev*0.15
            else:
                lost = drain - tank.current_gal
                self.state.stockout_gal_lost += lost
                self.state.stockout_count += 1
                tank.current_gal = 0
                reward -= lost * self.stockout_penalty
            reward -= tank.current_gal * self.holding_cost
            order = action.get(tid,0)
            # BUG: unbounded accumulation – missing pending check
            if order>0:
                cost = order * TANK_CONFIGS[tid]['price']
                self.state.total_cost += cost
                reward -= cost
                tank.pending_po_gal += order
                tank.pending_po_eta_hr = random.randint(4,8)
            tank.level_pct = tank.current_gal / tank.capacity * 100
            traces.append({'tank_id':tid,'hour':self.hour,'before_gal':before,'action_gal':order})
        self.hour+=1
        self.state.hour=self.hour
        self.state.day_of_week=(self.hour//24)%7
        done=self.hour>=self.max_hours
        if done:
            rate = self.state.stockout_count/self.hour if self.hour else 0
            reward -= rate*10000
        return self.state, reward, done, {'traces':traces}

    def reset(self):
        self.hour=0
        self.state=self._initial_state()
        return self.state

    def render(self):
        print(f"Hour {self.hour} Day {self.state.day_of_week} Rev ${self.state.total_revenue:.0f} Cost ${self.state.total_cost:.0f} Stockouts {self.state.stockout_count}")
