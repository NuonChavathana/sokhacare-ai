import { NextResponse } from 'next/server';
import { getMockDashboardStats } from '@/lib/db/mock-db';

export async function GET() {
  const stats = getMockDashboardStats();
  return NextResponse.json({ stats });
}
