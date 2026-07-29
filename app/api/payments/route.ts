import { NextResponse } from 'next/server';
import { MOCK_PAYMENTS } from '@/lib/mock-data';
export async function GET() {
  const avg = MOCK_PAYMENTS.reduce((a,b)=>a+b.uptime,0)/MOCK_PAYMENTS.length;
  return NextResponse.json({ payments: MOCK_PAYMENTS, avg_uptime: avg });
}
