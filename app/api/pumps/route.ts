import { NextResponse } from 'next/server';
import { MOCK_PUMPS } from '@/lib/mock-data';
export async function GET() {
  return NextResponse.json({ pumps: MOCK_PUMPS, critical: MOCK_PUMPS.filter(p=>p.status==='critical') });
}
