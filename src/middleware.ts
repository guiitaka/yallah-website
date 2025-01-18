import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const isMobile = /mobile|iphone|ipad|android|phone|webos|ipod|blackberry|windows phone/i.test(userAgent);
  const url = request.nextUrl.clone();
  const isMobilePath = url.pathname.startsWith('/mobile');

  // If mobile device and not already on mobile path, redirect to mobile version
  if (isMobile && !isMobilePath && !url.pathname.startsWith('/_next')) {
    url.pathname = `/mobile${url.pathname}`;
    return NextResponse.redirect(url);
  }

  // If desktop device and on mobile path, redirect to desktop version
  if (!isMobile && isMobilePath) {
    url.pathname = url.pathname.replace('/mobile', '');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 