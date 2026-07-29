#!/bin/bash
set -e
cd /app
pytest /tests/test_outputs.py -v
python3 << 'PYINNER'
import json, pathlib
eval_path = pathlib.Path('/tmp/eval.json')
reward = 1
if eval_path.exists():
    data = json.loads(eval_path.read_text())
    reward = 1 if data.get('passed') else 0
pathlib.Path('reward.txt').write_text(str(reward))
PYINNER
cat reward.txt
