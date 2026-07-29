# RL Env – Open Source

No Meta infra, only python + gymnasium.

```bash
cd docker
python3 env.py
python3 train.py --eval-only
python3 train.py --generate-traces 1000 --out traces.jsonl

# Build RL image
docker build -f Dockerfile.rl -t sbo-rl-env .
docker run --rm sbo-rl-env
```

See env.py for procurement simulation, train.py for heuristic + PPO stub + trace generation.
Traces include business_context + honest abstention 5% for training faithful summarization.
