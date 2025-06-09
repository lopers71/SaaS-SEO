import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify } from 'jsonwebtoken'

export async function middleware(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get('token')?.value

  // Check if the request is for an API route
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Allow public API routes
    if (
      request.nextUrl.pathname.startsWith('/api/auth/') ||
      request.nextUrl.pathname === '/api/seo-scanner' ||
      request.nextUrl.pathname === '/api/keyword-heatmap' ||
      request.nextUrl.pathname === '/api/citation-management'
    ) {
      return NextResponse.next()
    }

    // Verify token for protected API routes
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    try {
      verify(token, process.env.JWT_SECRET || 'your-secret-key')
      return NextResponse.next()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  }

  // Check if the request is for a protected page
  if (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/tools')
  ) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      verify(token, process.env.JWT_SECRET || 'your-secret-key')
      return NextResponse.next()
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/tools/:path*'
  ]
} 