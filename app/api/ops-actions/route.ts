import { NextResponse } from 'next/server';
import { getOpsActions } from '@/lib/mock-data';
export async function GET() {
  const actions = getOpsActions();
  return NextResponse.json({ actions, critical: actions.filter(a=>a.level==='critical').length });
}
