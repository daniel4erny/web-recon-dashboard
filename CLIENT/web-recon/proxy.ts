import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Check for some auth logic, such as an operator_key cookie
  const operatorKey = request.cookies.get('operator_key');
  const MASTER_KEY = process.env.MASTER_KEY;

  if (operatorKey?.value != MASTER_KEY || !operatorKey) {
    // If unauthorized, proxy the request to the static restricted.html file
    const url = request.nextUrl.clone();
    url.pathname = '/restricted.html';
    return NextResponse.rewrite(url);
  }

  // If authenticated, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  // Apply this middleware to the root page and other protected routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - restricted.html (the fallback page itself)
     */
    '/((?!api|_next/static|_next/image|restricted.html|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};