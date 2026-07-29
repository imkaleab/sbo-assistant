import { NextResponse } from 'next/server';
import { MOCK_CSTORE, MOCK_CSTORE_TREND } from '@/lib/mock-data';
export async function GET() {
  return NextResponse.json({
    stock: MOCK_CSTORE,
    trend: MOCK_CSTORE_TREND,
    low_stock: MOCK_CSTORE.filter(c=>c.low_stock),
    today_rev: MOCK_CSTORE_TREND[MOCK_CSTORE_TREND.length-1].rev,
  });
}
