# SBO Assistant – Gas Station Command Center

**Open Source Stack – 100% No Meta Infra**

Proposal: https://docs.google.com/document/d/1TcJtxiUX0xvsKIxfOKHwq-_Fd60xI-BjRhWggVAxlhc/edit?tab=t.0  
Author: Kaleb Alemu – AAI Labs Founding Engineers Proposal – Small business owners ops dashboard, gas station pilot

> **Problem:** Gas station owners juggle tank levels, pump uptime, payment systems, c-store inventory, revenue, inspections, expenses with no single source of truth.

> **Solution:** Centralized dashboard + monitoring – single pane of glass.

## Stack – 100% Open Source

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS 3.4, Recharts 2.12 (no XDS, no Nest libs)
- **Backend:** Next.js Route Handlers (`app/api/*`) – JSON APIs, no OIDC/CAT
- **Charting:** Recharts (open), not @nest/data-apps
- **RL Env:** Python + Gymnasium, no Meta infra – Docker-ready for training data generation (AAI Labs requirement Sec 4)
- **Deploy:** Vercel 1-click, or Docker, or any Node host

## Features – Gas Station Pilot (v1)

1. **Health Monitors**
   - Tank health operational/warning/critical – donut
   - Pump uptime % – bar (Pump 5 flagged 88.1%)
   - Payment uptime 7d – line

2. **Tank Operations**
   - Tank cards with progress bar, cur gal, level %, cur rev, est full, next refill, inspection score
   - Current vs Potential revenue bar (gap = opportunity)
   - Inventory forecast area (6d, Diesel critical tomorrow)
   - Inspection scores bar

3. **C-Store**
   - 7d revenue trend, stock units, revenue share donut
   - Low-stock alert Tobacco 88 < 100

4. **Expenses + Ops Checklist**
   - MTD expense breakdown – Fuel 55% $18.4k
   - Auto-generated actions – critical refill PO, pump maintenance, reorder
   - **Create PO button** → POST /api/refill-po → trace logged for RL training

## Quick Start

```bash
git clone sbo-assistant && cd sbo-assistant
npm install
npm run dev
# http://localhost:3000

# Production
npm run build
npm run start

# Vercel
vercel --prod
# or connect GitHub repo to Vercel dashboard – auto-deploy
```

## APIs – Open Source, No Auth (add your own later)

- GET /api/tanks → {tanks, forecast, summary}
- GET /api/pumps → {pumps, critical}
- GET /api/payments → {payments, avg_uptime}
- GET /api/cstore → {stock, trend, low_stock}
- GET /api/expenses → {expenses, total}
- GET /api/ops-actions → {actions, critical}
- POST /api/refill-po → {po_id, estimated_cost, trace} – creates PO, logs training trace
  ```bash
  curl -X POST http://localhost:3000/api/refill-po -H "Content-Type: application/json" -d '{"tank_id":"T3","gallons":5000}'
  ```

All use `lib/mock-data.ts` as single source – replace with Postgres/Prisma/Drizzle later.

## RL Environment – docker/ (AAI Labs Data Generation Sec 4)

Required: *create RL env (Docker likely) early, full-fidelity, for training data*

```bash
cd docker
python3 env.py                # random baseline smoke test
python3 train.py --eval-only  # heuristic baseline – 0 stockouts over 14d after fix
python3 train.py --generate-traces 1000 --out traces.jsonl  # 4000 traces JSONL for Avocado

# Docker (create Dockerfile manually – see docker/README.md)
docker build -t sbo-rl-env .
docker run --rm sbo-rl-env
```

**Env details:**
- State 4 tanks 6k-10k gal, drain 22-45 gal/hr + weekend 1.3x + 20% noise, pump uptime factor
- Action 0/1k/2.5k/5k/7.5k/10k gal per tank → maps to POST /api/refill-po
- Reward `0.15*revenue - cost - stockout*12 - holding*0.001 - stockout_rate*10000`
- Heuristic: <20% → 7500 gal, <30% → 5000, <40% & no pending → 2500 – achieves 0 stockouts
- Traces include `business_context` + 5% `abstain: "Unknown vendor ETA"` → honest abstention training (your primary domain)

**Trace example:**
```json
{"tank_id":"T3","before_gal":1200,"action_gal":5000,"after_gal":1170,"pct":19.5,"stockout":false,"ctx":"Tank T3 at 19.5% - CRITICAL","abstain":null}
```

## Data Model Proposal (Open, Future Postgres)

```sql
-- tanks(id, fuel_type, capacity, current_gal, level_pct, cur_rev, est_rev, next_refill, inspection_score, ds)
-- pumps(id, fuel_type, tank_id, uptime_pct, dispensed_7d, last_maintenance, status)
-- payments(date, uptime, failed, tx, amount)
-- cstore(category, units, rev, threshold, low_stock)
-- expenses(type, amt)
-- purchase_orders(po_id, tank_id, gallons, cost, eta, status, trace_json)
```

Migrate mock to DB via `drizzle-orm` + `lib/db/schema.ts` (add later).

## Deployment

**Vercel (recommended):**
```bash
npm i -g vercel
vercel --prod
```

**Docker (Next.js standalone):**
Add to next.config.js `output: 'standalone'` then:
```
docker build -t sbo-assistant -f Dockerfile.next .
docker run -p 3000:3000 sbo-assistant
```

**Any Node host:** `npm run build && npm run start`

## Training Data from Usage (AAI Labs Sec 4)

- Every PO creation → (state, action, reward, next_state) trace for Avocado RL
- Expense categorization corrections → annotation
- Inspection summary edits → grounded, faithful, cited summarization + honest abstention (your primary domain)
- Pump maintenance scheduling → trace corrections

## Milestones

- Week1 ✅ Repo + Mock APIs + RL env + Recharts dashboard – DONE (open source)
- Month1 MVP: CSV import for tanks/inventory, POS API stub (Square/Clover), email alerts for critical, first dogfooder
- Month2 v1: Real sensor integration if available, RL procurement agent as background job, expense LLM auto-categorization, mobile PWA, measurable impact (stockout rate, cost saved)

## License

MIT – open source, free for small business owners
