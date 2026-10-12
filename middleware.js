// middleware.js (di ROOT project, sejajar dengan folder app/)
// Melindungi route berdasarkan status login & role (admin/kasir).

import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';

export async function middleware(request) {
  const response = NextResponse.next();
  const session = await getIronSession(request, response, sessionOptions);
  const { pathname } = request.nextUrl;

  const isLoggedIn = !!session.user;
  const role = session.user?.role;

  // Halaman yang wajib login
  const butuhLogin = pathname.startsWith('/dashboard')
    || pathname.startsWith('/admin')
    || pathname.startsWith('/kasir');

  if (butuhLogin && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Halaman khusus admin
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/kasir/:path*'],
};