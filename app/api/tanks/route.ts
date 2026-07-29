import { NextResponse } from 'next/server';
import { MOCK_TANKS, MOCK_FORECAST } from '@/lib/mock-data';

export async function GET() {
  const totalCur = MOCK_TANKS.reduce((a,b)=>a+b.cur_rev,0);
  const totalEst = MOCK_TANKS.reduce((a,b)=>a+b.est_rev,0);
  return NextResponse.json({
    tanks: MOCK_TANKS,
    forecast: MOCK_FORECAST,
    summary: {
      total_gal: MOCK_TANKS.reduce((a,b)=>a+b.current_gal,0),
      total_cap: MOCK_TANKS.reduce((a,b)=>a+b.capacity,0),
      total_cur_rev: totalCur,
      total_est_rev: totalEst,
      gap_rev: totalEst-totalCur,
    },
    ds: new Date().toISOString().slice(0,10),
  });
}
