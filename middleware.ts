import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from './lib/auth-edge';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'wardidea02@gmail.com';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('admin-token')?.value;
  
  console.log(`🔍 Middleware check for path: ${path}, token exists: ${!!token}`);
  
  // Redirect authenticated users from home to dashboard
  if (path === '/') {
    if (token) {
      try {
        const payload = await verifyTokenEdge(token);
        if (payload && typeof payload === 'object' && 'email' in payload) {
          // ✅ تحقق من أن الإيميل هو إيميل الآدمن
          if (payload.email === ADMIN_EMAIL) {
            // ✅ توجيه تلقائي للآدمن إلى الداشبورد
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
          }
        }
      } catch (error) {
        console.log('🔐 Token verification failed:', error);
        // Clear expired token and continue to home page
        const response = NextResponse.next();
        response.cookies.delete('admin-token');
        return response;
      }
    }
    return NextResponse.next();
  }
  
  // Protect admin routes (except login page)
  if (path.startsWith('/admin') && path !== '/admin/login') {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    try {
      const payload = await verifyTokenEdge(token);
      
      if (!payload || typeof payload !== 'object' || !('email' in payload)) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      
      // ✅ تحقق من أن الإيميل هو إيميل الآدمن
      if (payload.email !== ADMIN_EMAIL) {
        console.log('🔐 Unauthorized email:', payload.email);
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    } catch (error) {
      console.log('🔐 JWT verification failed:', error);
      if (error instanceof Error && error.name === 'JWTExpired') {
        console.log('🔐 JWT token has expired, redirecting to login');
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('admin-token');
        return response;
      }
      // For other errors, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*'],
};
