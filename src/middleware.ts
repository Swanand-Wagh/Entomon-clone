import { NextResponse, NextRequest } from 'next/server';

import {
  AUTH_ROUTES,
  ADMIN_ROUTES,
  PUBLIC_ROUTES,
  ROUTE_MAPPINGS,
  API_AUTH_PREFIX,
  DEFAULT_LOGIN_REDIRECT,
} from '@/lib/routes';
import { getToken } from 'next-auth/jwt';

type routeMapping = keyof typeof ROUTE_MAPPINGS;

interface CustomToken {
  name: string | null | undefined;
  email: string | null | undefined;
  picture: string | null | undefined;
  sub: string | undefined;
  iat: number | undefined;
  exp: number | undefined;
  jti: string | undefined;
  role?: string; // Add the role property
  [key: string]: unknown;
}

export async function middleware(req: NextRequest) {
  const token = (await getToken({ req, secret: process.env.AUTH_SECRET })) as CustomToken;
  const role = token?.role;
  const isLoggedIn = !!token;

  const nextUrl = req.nextUrl;
  const pathname = nextUrl.pathname as routeMapping;

  // Handle route mappings
  if (pathname in ROUTE_MAPPINGS) {
    return NextResponse.redirect(new URL(ROUTE_MAPPINGS[pathname], nextUrl));
  }

  // Allow API auth routes
  if (pathname.startsWith(API_AUTH_PREFIX)) {
    return NextResponse.next();
  }

  // Prevent 'USER' role from accessing admin routes
  if (role === 'USER' && ADMIN_ROUTES.test(pathname)) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  // Handle authentication routes
  if (AUTH_ROUTES.includes(pathname)) {
    return isLoggedIn ? NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)) : NextResponse.next();
  }

  // Redirect unauthenticated users away from private routes
  if (!isLoggedIn && !PUBLIC_ROUTES.test(pathname)) {
    const callbackUrl = encodeURIComponent(`${nextUrl.pathname}${nextUrl.search}`);
    return NextResponse.redirect(new URL(`/auth/login?callbackUrl=${callbackUrl}`, nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};