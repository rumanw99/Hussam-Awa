import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-for-development';

export function generateToken(payload: any) {
  if (!JWT_SECRET) {
    console.error('❌ JWT_SECRET is not defined!');
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  console.log('🔐 Token generated for:', payload);
  return token;
}

export function verifyToken(token: string) {
  if (!JWT_SECRET) {
    console.error('❌ JWT_SECRET is not defined!');
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verified:', decoded);
    return decoded;
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    return null;
  }
}
