import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected route list
  const protectedPaths = [
    "/dashboard",
    "/workflows",
    "/integrations",
    "/runs",
    "/security",
    "/settings",
  ];

  const isProtected = protectedPaths.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  // Check for Supabase session or demo session cookie
  const hasDemoSession = request.cookies.has("flowpilot_demo_session");
  const hasSupabaseSession =
    request.cookies.has("sb-access-token") ||
    Array.from(request.cookies.getAll()).some((c) =>
      c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
    );

  const isAuthenticated = hasDemoSession || hasSupabaseSession;

  // Unauthenticated user attempting to access private route -> redirect to /login
  if (isProtected && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Already authenticated user visiting login or signup -> redirect to /dashboard
  if ((pathname === "/login" || pathname === "/signup") && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
