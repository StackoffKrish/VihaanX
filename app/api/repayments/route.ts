
import { NextResponse } from 'next/server';
import { seedState } from '@/lib/seed';
export async function GET() { const s = seedState(); return NextResponse.json({ repayments: s.repayments }); }
export async function POST(req: Request) {
  const body = await req.json();
  if (!body.amountPaise || body.amountPaise <= 0) return NextResponse.json({ error: 'Valid amount required' }, { status: 400 });
  return NextResponse.json({ ok: true, repayment: { id: 'RP-' + Date.now(), ...body, status: 'Completed' } });
}
