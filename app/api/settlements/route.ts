
import { NextResponse } from 'next/server';
import { seedState } from '@/lib/seed';
export async function GET() { const s = seedState(); return NextResponse.json({ settlements: s.settlements }); }
