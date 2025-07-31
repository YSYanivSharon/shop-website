import rateLimit from 'next-rate-limit';
import { NextRequest, NextResponse } from 'next/server';
import { getAuthLevel } from '@/lib/auth';
import { AuthLevel } from './lib/persist-module';

// TODO: Upgrade the rate limiter
const limiter = rateLimit({
  interval: 1, // 1 millisecond
  uniqueTokenPerInterval: 500 // Max 500 users per minute
});

// Routes that are only available for admins
const adminRoutes = ['/dashboard'];
// Routes that are available for everyone
const publicRoutes = ['/shop/user/login', '/shop/user/signup', '/index', '/llm', '/favicon.ico'];

export default async function middleware(request: NextRequest) {
  try {
    limiter.checkNext(request, 10);

    try {
      const auth_level = await getAuthLevel();
      const path = request.nextUrl.pathname

      const user_permitted = publicRoutes.includes(path) ||
        (auth_level == AuthLevel.Normal && !adminRoutes.includes(path)) ||
        (auth_level == AuthLevel.Admin);

      if (user_permitted) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL('/shop/user/login', request.url));
      }
    } catch (e) {
      console.log(e)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

  } catch {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
}

export const config = {
  runtime: 'nodejs',
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
