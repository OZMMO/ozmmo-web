import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
import { NextAuthRequest } from "next-auth/lib";
import { AppRouteHandlerFnContext } from "next-auth/lib/types";
import { NextRequest, NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// export default auth((req: NextAuthRequest, ctx: AppRouteHandlerFnContext) : void | Response | Promise<void | Response> => {
const authMiddleware = auth((req: NextAuthRequest, ctx: AppRouteHandlerFnContext): void | Response => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(new URL(
      `/auth/login?callbackUrl=${encodedCallbackUrl}`,
      nextUrl
    ));
  }

  return;
})

export function cookiesMiddleware(request: NextRequest) {
  // const activeOrganizationId = request.cookies.get('activeOrganizationId')?.value

  // // Si no hay una organización activa en la cookie, redirige a la página de selección de organización
  // if (!activeOrganizationId && !request.nextUrl.pathname.startsWith('/select-org')) {
  //   return NextResponse.redirect(new URL('/select-org', request.url))
  // }

  // // Si hay una organización activa, asegúrate de que la URL coincida
  // if (activeOrganizationId && !request.nextUrl.pathname.includes(`/organization/${activeOrganizationId}`)) {
  //   return NextResponse.redirect(new URL(`/organization/${activeOrganizationId}${request.nextUrl.pathname}`, request.url))
  // }

  return NextResponse.next()
}

export default async function middleware(request: NextAuthRequest, ctx: AppRouteHandlerFnContext) {
  // First, run the auth middleware
  const authResponse = await authMiddleware(request, ctx);
  
  // If auth middleware returns a response, return it immediately
  if (authResponse) return authResponse;
  
  // Otherwise, continue to the new middleware
  return cookiesMiddleware(request);
}

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}