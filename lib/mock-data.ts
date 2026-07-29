export const MOCK_TANKS = [
  { id: 'T1', fuel: 'Regular 87', fuel_type: 'REG_87', capacity: 10000, current_gal: 3200, level_pct: 32, price_per_gal: 3.40, cur_rev: 10880, est_rev: 34000, next_refill: '2026-07-28', inspection_score: 92, vendor: 'FuelCo East', status: 'warning' as const },
  { id: 'T2', fuel: 'Premium 93', fuel_type: 'PREM_93', capacity: 8000, current_gal: 6100, level_pct: 76, price_per_gal: 3.90, cur_rev: 23790, est_rev: 31200, next_refill: '2026-07-31', inspection_score: 85, vendor: 'FuelCo East', status: 'operational' as const },
  { id: 'T3', fuel: 'Diesel', fuel_type: 'DIESEL', capacity: 6000, current_gal: 1200, level_pct: 20, price_per_gal: 4.50, cur_rev: 5400, est_rev: 27000, next_refill: '2026-07-27', inspection_score: 68, vendor: 'FuelCo East', status: 'critical' as const },
  { id: 'T4', fuel: 'Regular 87 - Aux', fuel_type: 'REG_87_AUX', capacity: 10000, current_gal: 8900, level_pct: 89, price_per_gal: 3.40, cur_rev: 30260, est_rev: 34000, next_refill: '2026-08-02', inspection_score: 95, vendor: 'FuelCo East', status: 'operational' as const },
];

export const MOCK_PUMPS = [
  { id: 'P1', name: 'Pump 1 - Regular', fuel_type: 'REG_87', tank_id: 'T1', uptime_pct: 99.8, dispensed_7d: 842, today: 121, last_maintenance: '2026-06-20', status: 'operational' as const },
  { id: 'P2', name: 'Pump 2 - Regular', fuel_type: 'REG_87', tank_id: 'T1', uptime_pct: 99.2, dispensed_7d: 791, today: 98, last_maintenance: '2026-06-15', status: 'operational' as const },
  { id: 'P3', name: 'Pump 3 - Premium', fuel_type: 'PREM_93', tank_id: 'T2', uptime_pct: 97.5, dispensed_7d: 432, today: 67, last_maintenance: '2026-06-10', status: 'warning' as const },
  { id: 'P4', name: 'Pump 4 - Diesel', fuel_type: 'DIESEL', tank_id: 'T3', uptime_pct: 100, dispensed_7d: 621, today: 89, last_maintenance: '2026-07-01', status: 'operational' as const },
  { id: 'P5', name: 'Pump 5 - Regular', fuel_type: 'REG_87', tank_id: 'T1', uptime_pct: 88.1, dispensed_7d: 210, today: 22, last_maintenance: '2026-06-01', status: 'critical' as const, alert: '45 days overdue maintenance' },
  { id: 'P6', name: 'Pump 6 - Diesel', fuel_type: 'DIESEL', tank_id: 'T3', uptime_pct: 99.5, dispensed_7d: 556, today: 81, last_maintenance: '2026-06-25', status: 'operational' as const },
];

export const MOCK_PAYMENTS = [
  { date: '2026-07-21', uptime: 99.95, failed: 2, tx: 412, amount: 12450, gateway: '2.4.1' },
  { date: '2026-07-22', uptime: 99.92, failed: 3, tx: 389, amount: 11320, gateway: '2.4.1' },
  { date: '2026-07-23', uptime: 98.4, failed: 12, tx: 401, amount: 12100, gateway: '2.4.1', incident: 'Gateway timeout 14:22-14:45' },
  { date: '2026-07-24', uptime: 99.98, failed: 1, tx: 445, amount: 13450, gateway: '2.4.1' },
  { date: '2026-07-25', uptime: 99.1, failed: 8, tx: 398, amount: 11980, gateway: '2.4.1' },
  { date: '2026-07-26', uptime: 99.96, failed: 2, tx: 467, amount: 14210, gateway: '2.4.1' },
  { date: '2026-07-27', uptime: 99.99, failed: 0, tx: 223, amount: 6890, gateway: '2.4.1' },
];

export const MOCK_CSTORE = [
  { category: 'Beverages', units: 342, rev: 4210, revenue_7d: 4210, today: 623, threshold: 100, low_stock: false },
  { category: 'Snacks', units: 210, rev: 3890, revenue_7d: 3890, today: 512, threshold: 80, low_stock: false },
  { category: 'Tobacco', units: 88, rev: 5120, revenue_7d: 5120, today: 890, threshold: 100, low_stock: true },
  { category: 'Automotive', units: 156, rev: 1230, revenue_7d: 1230, today: 145, threshold: 50, low_stock: false },
  { category: 'Lottery', units: 412, rev: 2980, revenue_7d: 2980, today: 412, threshold: 200, low_stock: false },
];

export const MOCK_CSTORE_TREND = [
  { day: 'Mon', rev: 2100, tx: 98 },
  { day: 'Tue', rev: 2450, tx: 110 },
  { day: 'Wed', rev: 1980, tx: 92 },
  { day: 'Thu', rev: 4210, tx: 145 },
  { day: 'Fri', rev: 5230, tx: 172 },
  { day: 'Sat', rev: 4890, tx: 165 },
  { day: 'Sun', rev: 4230, tx: 143 },
];

export const MOCK_EXPENSES = [
  { type: 'Fuel Procurement', amt: 18400 },
  { type: 'C-Store Inventory', amt: 6200 },
  { type: 'Labor', amt: 4300 },
  { type: 'Utilities', amt: 1200 },
  { type: 'Maintenance', amt: 2100 },
  { type: 'Fees', amt: 890 },
];

export const MOCK_FORECAST = [
  { date: 'Jul 27', Regular: 3200, Premium: 6100, Diesel: 1200 },
  { date: 'Jul 28', Regular: 2100, Premium: 5400, Diesel: 600 },
  { date: 'Jul 29', Regular: 800, Premium: 4700, Diesel: 200 },
  { date: 'Jul 30', Regular: 5000, Premium: 4000, Diesel: 5000 },
  { date: 'Jul 31', Regular: 4200, Premium: 3300, Diesel: 4300 },
  { date: 'Aug 01', Regular: 3500, Premium: 2600, Diesel: 3600 },
];

export function getOpsActions() {
  return [
    { level: 'critical', title: 'Diesel T3 at 20%', message: '1,200 gal – empty tomorrow. Create PO? $18.4k for 10k gal. Vendor FuelCo East – ETA 6h.', tank_id: 'T3', action: 'create_po' },
    { level: 'warning', title: 'Pump 5 uptime 88.1%', message: '210 gal vs 800 avg. Last maintenance 45d ago. Lost $1.2k/week.', pump_id: 'P5', action: 'schedule_maintenance' },
    { level: 'info', title: 'Tobacco low stock', message: '88 < 100 threshold – reorder to TobaccoPlus', action: 'reorder_cstore' },
    { level: 'ok', title: 'Payments nominal', message: '99.99% today, 0 failed tx. Gateway v2.4.1 healthy', action: 'none' },
  ];
}
