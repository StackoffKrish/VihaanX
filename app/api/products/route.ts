
import { NextResponse } from 'next/server';
import { seedProducts } from '@/lib/seed';
export async function GET() { return NextResponse.json({ products: seedProducts() }); }
