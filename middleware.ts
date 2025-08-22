// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // cookie ichidan token olish

  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register");

  if (!token && !isAuthPage) {
    // login qilmagan bo‘lsa -> login pagega yuboramiz
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthPage) {
    // login qilgan user login/register pagega kira olmaydi
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// qaysi routelarda ishlashi kerakligini belgilaymiz
export const config = {
  matcher: ["/((?!_next|api|static|.*\\..*).*)"],
};
