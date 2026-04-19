import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, fullName, role } = body ?? {};

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await registerUser(email, password, fullName, role);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ user: result.user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}