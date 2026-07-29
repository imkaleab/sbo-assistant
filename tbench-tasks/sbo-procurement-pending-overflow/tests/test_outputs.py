
import subprocess, pathlib, json
def run(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=60, cwd='/app')
    return r
def test_import():
    r = run('python3 -c "from docker.env import GasStationProcurementEnv"')
    assert r.returncode==0, r.stderr
def test_pending_logic_fixed():
    code = pathlib.Path('/app/docker/env.py').read_text()
    assert 'pending_po_gal==0' in code or 'pending_po_gal == 0' in code
def test_zero_stockouts():
    r = run('python3 docker/train.py')
    print(r.stdout)
    assert 'stockouts=0' in r.stdout
if __name__ == '__main__':
    tests = [test_import, test_pending_logic_fixed, test_zero_stockouts]
    results=[]
    ok=True
    for t in tests:
        try:
            t()
            results.append((t.__name__, True))
        except Exception as e:
            results.append((t.__name__, False, str(e)))
            ok=False
    pathlib.Path('/tmp/eval.json').write_text(json.dumps({'passed': ok, 'results': results}, indent=2))
    print(json.dumps({'passed': ok, 'results': results}, indent=2))
    if not ok:
        raise SystemExit(1)
