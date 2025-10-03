import { NextRequest, NextResponse } from 'next/server';
import { generateTokenEdge } from '../../../../lib/auth-edge';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = await generateTokenEdge({ email });
      console.log("🟢 Generated token:", token);
    
      const response = NextResponse.json({ 
        success: true,
        message: 'Login successful'
      });
    
      // Set cookie with proper configuration
      response.cookies.set('admin-token', token, { 
        httpOnly: true,
        maxAge: 3600,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
      
      console.log("🟢 Cookie set successfully for token:", token.substring(0, 20) + "...");
    
      return response;
    } else {
      return NextResponse.json({ 
        success: false,
        message: 'Invalid credentials' 
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Invalid request' 
    }, { status: 400 });
  }
}
