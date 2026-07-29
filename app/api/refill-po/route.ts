import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tank_id, gallons, fuel_type, vendor } = body;
  if (!tank_id || !gallons) return NextResponse.json({ error: 'tank_id and gallons required' }, { status: 400 });

  const po = {
    po_id: `PO-${Date.now()}`,
    tank_id,
    fuel_type: fuel_type ?? 'REG_87',
    gallons,
    vendor: vendor ?? 'FuelCo East',
    estimated_cost: gallons * 3.4,
    eta_hours: Math.floor(Math.random()*4)+4,
    created_at: new Date().toISOString(),
    status: 'submitted',
    trace: {
      state_before: { tank_id, level_pct: 20 },
      action: { gallons, vendor },
      reward_hint: 'Avoid stockout, minimize holding cost',
    },
  };
  console.log(`[SBO] PO created: ${JSON.stringify(po)}`);
  return NextResponse.json({ ok: true, purchase_order: po });
}

export async function GET() {
  return NextResponse.json({
    purchase_orders: [
      { po_id: 'PO-001', tank_id: 'T3', fuel_type: 'DIESEL', gallons: 5000, status: 'delivered', cost: 22500 },
      { po_id: 'PO-002', tank_id: 'T1', fuel_type: 'REG_87', gallons: 6800, status: 'in_transit', eta: '2026-07-28T08:00:00Z', cost: 23120 },
    ],
  });
}
