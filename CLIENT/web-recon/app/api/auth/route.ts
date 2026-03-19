import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const MASTER_KEY = process.env.MASTER_KEY;
  try {
    const { key } = await request.json();
    const validKey = process.env.PASS;

    if (!validKey) {
      console.warn('PASS environment variable is not set.');
    }

    if (key === validKey) {
      // Set the operator_key cookie and return success
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'operator_key',
        value: MASTER_KEY ?? "no env", // Může být i podepsaný JWT token apod.
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 den
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid operator key' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 });
  }
}