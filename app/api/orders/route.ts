
import { NextResponse } from 'next/server';
import { seedState } from '@/lib/seed';
export async function GET() { const s = seedState(); return NextResponse.json({ orders: s.orders }); }
export async function POST(req: Request) {
  const body = await req.json();
  if (!body.items || !body.paymentMethod) return NextResponse.json({ error: 'Items and paymentMethod required' }, { status: 400 });
  return NextResponse.json({ ok: true, order: { id: 'FK' + Date.now().toString().slice(-4), ...body, status: 'Order received' } }, { status: 201 });
}
