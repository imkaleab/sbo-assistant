#!/bin/bash
set -e
cd /app
echo "[oracle] fixing docker/env.py pending logic"
python3 << 'PYPY'
import pathlib
p = pathlib.Path('docker/env.py')
code = p.read_text()
code = code.replace('if order>0:', 'if order>0 and (tank.pending_po_gal==0 or tank.level_pct<10):')
p.write_text(code)
print("fixed env.py")
PYPY
echo "oracle applied"
python3 docker/train.py
