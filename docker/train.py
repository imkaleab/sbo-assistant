
import argparse, json, random
from env import GasStationProcurementEnv, TANK_CONFIGS

def heuristic_policy(state):
    action={}
    for tid,tank in state.tanks.items():
        if tank.level_pct < 10:
            # Emergency: force refill even if pending exists (overwrite)
            action[tid]= 10000
        elif tank.level_pct < 20:
            action[tid]= 7500 if tank.capacity>=8000 else 5000
        elif tank.level_pct < 30:
            action[tid]= 5000
        elif tank.level_pct < 40 and tank.pending_po_gal==0:
            action[tid]= 2500
        else:
            action[tid]=0
    return action

def run_eval(episodes=3):
    print("=== Heuristic Baseline Eval ===")
    for ep in range(episodes):
        env=GasStationProcurementEnv(max_hours=24*14)
        env.reset()
        total=0
        for _ in range(24*14):
            act=heuristic_policy(env.state)
            _,r,done,_=env.step(act)
            total+=r
            if done: break
        print(f"Ep {ep}: reward={total:.0f} stockouts={env.state.stockout_count} lost={env.state.stockout_gal_lost:.0f} rev=${env.state.total_revenue:.0f} cost=${env.state.total_cost:.0f}")
        env.render()

def gen_traces(steps=1000, out="traces.jsonl"):
    print(f"Gen {steps} -> {out}")
    env=GasStationProcurementEnv(max_hours=steps)
    env.reset()
    with open(out,'w') as f:
        for _ in range(steps):
            act= heuristic_policy(env.state) if random.random()<0.7 else {tid: random.choice(env.gal_options) for tid in TANK_CONFIGS}
            _,reward,done,info=env.step(act)
            for tr in info['traces']:
                # add honest abstention example 5% of time
                tr['abstain'] = "Unknown vendor ETA – cannot guarantee 6h" if random.random()<0.05 else None
                f.write(json.dumps(tr)+"\n")
            if done:
                env.reset()
    print(f"Wrote {out}")

if __name__=='__main__':
    import sys
    parser=argparse.ArgumentParser()
    parser.add_argument('--eval-only', action='store_true')
    parser.add_argument('--generate-traces', type=int, default=0)
    parser.add_argument('--out', default='traces.jsonl')
    parser.add_argument('--train', action='store_true')
    parser.add_argument('--timesteps', type=int, default=50000)
    args=parser.parse_args()
    if args.eval_only: run_eval()
    if args.generate_traces>0: gen_traces(args.generate_traces, args.out)
    if args.train:
        print("Train requires torch + SB3 – see requirements.txt")
    if not args.eval_only and args.generate_traces==0 and not args.train:
        run_eval()
