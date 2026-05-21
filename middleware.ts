import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { DEMO_SESSION_COOKIE } from '@/lib/demo-session-constants'

function isValidDemoSession(raw: string | undefined): boolean {
  if (!raw) return false
  try {
    const data = JSON.parse(decodeURIComponent(raw)) as { exp?: number }
    return typeof data.exp === 'number' && data.exp > Date.now()
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const cookie = request.cookies.get(DEMO_SESSION_COOKIE)?.value
    if (!isValidDemoSession(cookie)) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
