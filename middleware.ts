import rateLimit from 'next-rate-limit';
import { NextRequest, NextResponse } from 'next/server'
import { AuthLevel, getAuthLevel } from '@/app/lib/auth'

// TODO: Upgrade the rate limiter
const limiter = rateLimit({
  interval: 1, // 1 millisecond
  uniqueTokenPerInterval: 500 // Max 500 users per minute
});

// Routes that are only available for admins
const adminRoutes = ['/dashboard'];
// Roytes that are available for everyone
const publicRoutes = ['/login', '/signup', '/index', '/llm', '/favicon.ico'];

export async function middleware(request: NextRequest) {
  try {
    // TODO: Improve and reenable
    // limiter.checkNext(request, 10);

    try {
      const auth_level = await getAuthLevel(request);
      const path = request.nextUrl.pathname
      console.log(path)

      const user_permitted = publicRoutes.includes(path) ||
        (auth_level == AuthLevel.User && !adminRoutes.includes(path)) ||
        (auth_level == AuthLevel.Admin);

      if (user_permitted) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect('/login');
      }
    } catch {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

  } catch {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
}
