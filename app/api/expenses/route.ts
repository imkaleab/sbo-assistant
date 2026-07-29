import { NextResponse } from 'next/server';
import { MOCK_EXPENSES } from '@/lib/mock-data';
export async function GET() {
  const total = MOCK_EXPENSES.reduce((a,b)=>a+b.amt,0);
  return NextResponse.json({ expenses: MOCK_EXPENSES, total });
}
