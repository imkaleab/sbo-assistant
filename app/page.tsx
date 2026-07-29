"use client";

import { useEffect, useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { MOCK_TANKS, MOCK_PUMPS, MOCK_PAYMENTS, MOCK_CSTORE, MOCK_CSTORE_TREND, MOCK_EXPENSES, MOCK_FORECAST, getOpsActions } from "@/lib/mock-data";

const COLORS = ["#0ea5e9", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6", "#ec4899"];

function StatCard({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone?: "red"|"green" }) {
  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm ${tone==="red" ? "border-red-200 bg-red-50/50" : tone==="green" ? "border-green-200" : "border-slate-200"}`}>
      <div className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

function TankCard({ tank, onCreatePO, creating }: any) {
  const pct = tank.level_pct;
  const critical = pct < 25;
  const warning = pct < 35;
  return (
    <div className={`rounded-xl border p-4 ${critical ? "bg-red-50 border-red-200" : warning ? "bg-amber-50 border-amber-200" : "bg-white border-slate-200"}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-sm">{tank.id} • {tank.fuel}</span>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${critical ? "bg-red-100 text-red-700" : warning ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{pct}% • {tank.current_gal.toLocaleString()} gal</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-3"><div className={`h-full rounded-full ${critical ? "bg-red-500" : warning ? "bg-amber-500" : "bg-emerald-500"}`} style={{width:`${pct}%`}} /></div>
      <div className="flex justify-between text-[11px] text-slate-600"><span>Now ${tank.cur_rev.toLocaleString()}</span><span>Full ${tank.est_rev.toLocaleString()}</span></div>
      <div className="flex justify-between text-[11px] text-slate-500 mt-1"><span>Refill {tank.next_refill}</span><span>Insp {tank.inspection_score}/100</span></div>
      <button onClick={() => onCreatePO(tank.id, Math.round(tank.capacity*0.6))} disabled={creating} className="mt-3 w-full text-xs bg-slate-900 text-white rounded-lg py-2 hover:bg-slate-800 disabled:opacity-50">
        {creating ? "Creating..." : `Create Refill PO • ${tank.id}`}
      </button>
    </div>
  );
}

export default function SBOPage() {
  const [liveTanks, setLiveTanks] = useState<any[]|null>(null);
  const [liveActions, setLiveActions] = useState<any[]|null>(null);
  const [creating, setCreating] = useState(false);
  const [apiMode, setApiMode] = useState<"mock"|"live">("mock");

  useEffect(() => {
    Promise.all([
      fetch("/api/tanks").then(r=>r.ok?r.json():null).catch(()=>null),
      fetch("/api/ops-actions").then(r=>r.ok?r.json():null).catch(()=>null),
    ]).then(([t, o]) => {
      if (t?.tanks) { setLiveTanks(t.tanks); setApiMode("live"); }
      if (o?.actions) setLiveActions(o.actions);
    });
  }, []);

  const tanks = liveTanks ?? MOCK_TANKS;
  const ops = liveActions ?? getOpsActions();

  const handlePO = async (tank_id: string, gallons: number) => {
    setCreating(true);
    try {
      const res = await fetch("/api/refill-po", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ tank_id, gallons }) });
      const data = await res.json();
      alert(`PO Created: ${data.purchase_order.po_id}\nTank ${tank_id} ${gallons} gal\nCost $${data.purchase_order.estimated_cost.toLocaleString()}\nETA ${data.purchase_order.eta_hours}h\nTrace logged for RL training`);
    } catch(e) { alert("Failed"); console.error(e); } finally { setCreating(false); }
  };

  const tankHealth = useMemo(() => [{name:"Operational", value: tanks.filter((t:any)=>t.status==="operational").length}, {name:"Warning", value: tanks.filter((t:any)=>t.status==="warning").length}, {name:"Critical", value: tanks.filter((t:any)=>t.status==="critical").length}], [tanks]);
  const revenueCompare = useMemo(() => tanks.map((t:any)=>({ tank: t.fuel ?? t.id, Current: t.cur_rev ?? t.current_gal*3.4, Potential: t.est_rev ?? t.capacity*3.4 })), [tanks]);
  const totalCur = tanks.reduce((a:any,b:any)=>a+(b.cur_rev??0),0);
  const totalEst = tanks.reduce((a:any,b:any)=>a+(b.est_rev??0),0);

  return (
    <div className="max-w-[1280px] mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 border bg-white rounded-full px-3 py-1 text-[11px] font-semibold tracking-widest uppercase text-slate-600 mb-3">
          <span className={`w-2 h-2 rounded-full ${apiMode==="live" ? "bg-emerald-500" : "bg-amber-500"}`} /> {apiMode==="live" ? "Live API • Open Source" : "Mock Data • APIs ready"} • Next.js • Vercel • Recharts • Gas Station Pilot
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">SBO Assistant – Gas Station Command Center</h1>
        <p className="text-slate-600 max-w-3xl mx-auto mt-2">100% open source – React / Next.js / Tailwind / Recharts. Single source of truth for tank health, pump uptime, payment systems, refill forecasts, inspections & c-store ops. Cost: $0 infra, deploy to Vercel in 1 click.</p>
        <p className="text-xs text-slate-400 mt-2">Stack: Next.js 14 • Recharts • Tailwind • No Meta infra • Founder Kaleb Alemu • <a className="underline" href="https://github.com">GitHub: sbo-assistant</a></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Fuel Revenue Now" value={`$${totalCur.toLocaleString()}`} sub={`Potential $${totalEst.toLocaleString()} • Gap $${(totalEst-totalCur).toLocaleString()}`} />
        <StatCard label="Fuel Dispensed 7d" value="3,452 gal" sub="Avg 493 gal/d • 2,735 txs • Pump 5 flagged" />
        <StatCard label="C-Store Today" value="$4,230" sub="143 txs • Tobacco low (88 < 100)" />
        <StatCard label="Critical Alerts" value="2 Active" sub="T3 Diesel 20% • Pump 5 88.1%" tone="red" />
      </div>

      <h2 className="text-lg font-semibold mt-8 mb-3">1. Health – Tank / Pump / Payment</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4 shadow-sm"><div className="font-semibold mb-2">Tank Health</div><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={tankHealth} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{tankHealth.map((e,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div></div>
        <div className="bg-white rounded-xl border p-4 shadow-sm"><div className="font-semibold mb-2">Pump Uptime %</div><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={MOCK_PUMPS}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" tick={{fontSize:10}} interval={0} angle={-15} dy={10} height={60}/><YAxis domain={[80,100]}/><Tooltip/><Bar dataKey="uptime_pct" fill="#0ea5e9" /></BarChart></ResponsiveContainer></div><p className="text-xs text-slate-500 mt-1">Pump 5 at 88.1% – schedule maintenance – 45d overdue</p></div>
        <div className="bg-white rounded-xl border p-4 shadow-sm"><div className="font-semibold mb-2">Payment Uptime 7d</div><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={MOCK_PAYMENTS}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="date"/><YAxis domain={[98,100]}/><Tooltip/><Line type="monotone" dataKey="uptime" stroke="#10b981" strokeWidth={2} dot/></LineChart></ResponsiveContainer></div><p className="text-xs text-slate-500">Spike failed tx 12 on 07-23 – gateway timeout</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {tanks.map((t:any)=><TankCard key={t.id} tank={{...t, next_refill: t.next_refill, level_pct: t.level_pct ?? t.pct, current_gal: t.current_gal ?? t.cur, cur_rev: t.cur_rev ?? t.estimated_cost, est_rev: t.est_rev ?? t.capacity*3.4, inspection_score: t.inspection_score ?? t.score}} onCreatePO={handlePO} creating={creating} />)}
      </div>

      <h2 className="text-lg font-semibold mt-8 mb-3">2. Revenue, Refill Forecast & Inspections</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4 shadow-sm"><div className="font-semibold mb-2">Current vs Potential Revenue</div><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={revenueCompare}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="tank"/><YAxis/><Tooltip/><Legend/><Bar dataKey="Current" fill="#0ea5e9"/><Bar dataKey="Potential" fill="#94a3b8"/></BarChart></ResponsiveContainer></div></div>
        <div className="bg-white rounded-xl border p-4 shadow-sm"><div className="font-semibold mb-2">Inventory Forecast – Next Refill</div><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={MOCK_FORECAST}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="date"/><YAxis/><Tooltip/><Legend/><Area type="monotone" dataKey="Regular" stackId="1" stroke="#0ea5e9" fill="#0ea5e9"/><Area type="monotone" dataKey="Premium" stackId="1" stroke="#f59e0b" fill="#f59e0b"/><Area type="monotone" dataKey="Diesel" stackId="1" stroke="#ef4444" fill="#ef4444"/></AreaChart></ResponsiveContainer></div><p className="text-xs text-red-600 mt-1">Diesel hits ~200 gal tomorrow – auto-order suggested</p></div>
        <div className="bg-white rounded-xl border p-4 shadow-sm"><div className="font-semibold mb-2">Inspection Scores</div><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={tanks}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="fuel"/><YAxis domain={[0,100]}/><Tooltip/><Bar dataKey="inspection_score">{tanks.map((_:any,i:number)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}</Bar></BarChart></ResponsiveContainer></div><p className="text-xs text-amber-600">T3 68/100 – schedule inspection</p></div>
      </div>

      <h2 className="text-lg font-semibold mt-8 mb-3">3. Convenience Store – Stock & Revenue</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4 shadow-sm"><div className="font-semibold mb-2">Revenue Trend 7d</div><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={MOCK_CSTORE_TREND}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="day"/><YAxis/><Tooltip/><Area type="monotone" dataKey="rev" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3}/></AreaChart></ResponsiveContainer></div><p className="text-xs text-slate-500">Fri/Sat peak weekend rush $5.2k</p></div>
        <div className="bg-white rounded-xl border p-4 shadow-sm"><div className="font-semibold mb-2">Stock Units by Category</div><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={MOCK_CSTORE}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="category" tick={{fontSize:10}}/><YAxis/><Tooltip/><Bar dataKey="units" fill="#10b981"/></BarChart></ResponsiveContainer></div><p className="text-xs text-red-600">Tobacco 88 less than threshold 100</p></div>
        <div className="bg-white rounded-xl border p-4 shadow-sm"><div className="font-semibold mb-2">Revenue Share</div><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={MOCK_CSTORE} dataKey="rev" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>{MOCK_CSTORE.map((_:any,i:number)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer></div><p className="text-xs text-slate-500">Tobacco 32% despite low stock</p></div>
      </div>

      <h2 className="text-lg font-semibold mt-8 mb-3">4. Expenses & Ops Checklist</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4 shadow-sm"><div className="font-semibold mb-2">Expense Breakdown MTD</div><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={MOCK_EXPENSES} dataKey="amt" nameKey="type" cx="50%" cy="50%" outerRadius={80} label>{MOCK_EXPENSES.map((_:any,i:number)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer></div><p className="text-xs text-slate-500">Fuel procurement 55% – $18.4k</p></div>
        <div className="lg:col-span-2 bg-white rounded-xl border p-5 shadow-sm">
          <div className="font-semibold mb-3">Ops Checklist – Auto-generated {liveActions ? "(Live API)" : "(Mock)"}</div>
          <div className="flex flex-col gap-2">
            {ops.map((a:any,i:number)=>(
              <div key={i} className={`flex gap-2 p-3 rounded-lg border text-sm ${a.level==="critical"?"bg-red-50 border-red-200":a.level==="warning"?"bg-amber-50 border-amber-200":a.level==="ok"?"bg-emerald-50 border-emerald-200":"bg-slate-50 border-slate-200"}`}>
                <span className={`font-bold text-xs mt-0.5 ${a.level==="critical"?"text-red-700":a.level==="warning"?"text-amber-700":a.level==="ok"?"text-emerald-700":"text-slate-600"}`}>{a.level.toUpperCase()}</span>
                <span><b>{a.title}:</b> {a.message}</span>
              </div>
            ))}
            <div className="mt-3 text-[11px] text-slate-500 border-t pt-3">
              <b>Open Source APIs:</b> <code>GET /api/tanks</code> <code>/api/pumps</code> <code>/api/payments</code> <code>/api/cstore</code> <code>/api/expenses</code> <code>/api/ops-actions</code> <code>POST /api/refill-po</code> – zero infra, deploy to Vercel.<br/>
              <b>RL Env:</b> <code>docker/env.py</code> 0 stockouts heuristic over 14d – <code>python train.py --generate-traces 5000</code> → JSONL for Avocado training.<br/>
              <b>Zero Meta infra:</b> Only Next.js + Recharts + Tailwind + Python gymnasium.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-500">
        <div className="bg-white rounded-xl border p-4"><b>Vercel Deploy</b><br/><code className="text-[11px]">vercel --prod</code><br/>Env: none needed for mock. Add DATABASE_URL for Postgres later.</div>
        <div className="bg-white rounded-xl border p-4"><b>Data Model v1 (Open)</b><br/>tanks, pumps, payments, cstore, expenses – see lib/mock-data.ts – future Postgres: <code>drizzle-orm</code> + <code>lib/db/schema.ts</code></div>
        <div className="bg-white rounded-xl border p-4"><b>Training Data</b><br/>Every PO → trace JSONL with business_context + honest abstention 5% – for AAI Labs data generation</div>
      </div>

      <div className="text-center py-8 text-[11px] text-slate-400">
        Open source • MIT • Built for small business owners • Gas station pilot • Week1 Repo+APIs+RL ✅ • Month1 CSV import + POS + alerts • Month2 RL agent + expense LLM + mobile
      </div>
    </div>
  );
}
