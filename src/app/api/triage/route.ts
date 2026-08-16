import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Redirect legacy /api/triage to /api/predict
  const redirectUrl = new URL('/api/predict', req.url);
  return NextResponse.redirect(redirectUrl, { status: 308 });
}

export async function GET(req: NextRequest) {
  const redirectUrl = new URL('/api/predict', req.url);
  return NextResponse.redirect(redirectUrl, { status: 308 });
}
