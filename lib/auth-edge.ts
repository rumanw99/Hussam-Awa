import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-key-for-development'
);

export async function generateTokenEdge(payload: any): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(JWT_SECRET);
  
  console.log('🔐 Edge token generated for:', payload);
  return token;
}

export async function verifyTokenEdge(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log('✅ Edge token verified:', payload);
    return payload;
  } catch (error) {
    console.error('❌ Edge token verification failed:', error);
    // Re-throw the error so middleware can handle it
    throw error;
  }
}
