import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { ADMIN_LOGIN_PATH, INTERNAL_ADMIN_LOGIN_PATH } from "@/lib/admin";
import { routing } from "@/lib/i18n";
import { updateSession } from "@/lib/supabase/middleware";

const handleI18nRouting = createIntlMiddleware(routing);

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === ADMIN_LOGIN_PATH) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = INTERNAL_ADMIN_LOGIN_PATH;
    return updateSession(request, NextResponse.rewrite(rewriteUrl));
  }

  if (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith(INTERNAL_ADMIN_LOGIN_PATH) ||
    request.nextUrl.pathname.startsWith("/api")
  ) {
    return updateSession(request);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
