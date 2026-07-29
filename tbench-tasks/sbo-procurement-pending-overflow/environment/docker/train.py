
import random
from env import GasStationProcurementEnv, TANK_CONFIGS

def heuristic_policy(state):
    action={}
    for tid,tank in state.tanks.items():
        if tank.level_pct < 20:
            action[tid]=7500 if tank.capacity>=8000 else 5000
        elif tank.level_pct < 30:
            action[tid]=5000
        elif tank.level_pct < 40:
            action[tid]=2500
        else:
            action[tid]=0
    return action

def run_eval():
    env=GasStationProcurementEnv(max_hours=24*14)
    env.reset()
    total=0
    for _ in range(24*14):
        act=heuristic_policy(env.state)
        _,r,done,_=env.step(act)
        total+=r
        if done: break
    print(f"reward={total:.0f} stockouts={env.state.stockout_count} lost={env.state.stockout_gal_lost:.0f}")
    env.render()

if __name__=='__main__':
    run_eval()
