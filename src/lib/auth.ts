import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-this');

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    if (!token) return false;

    // If token has Bearer prefix, remove it
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    await jwtVerify(cleanToken, JWT_SECRET);
    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export async function verifyAdminAuth(request: Request): Promise<boolean> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return false;

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    return await verifyAdminToken(token);
  } catch {
    return false;
  }
}
