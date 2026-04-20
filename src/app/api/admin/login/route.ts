import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-this');

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }

    // Server-side credential check (from non-public env vars)
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token (more secure than base64)
    const token = await new SignJWT({ admin: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
