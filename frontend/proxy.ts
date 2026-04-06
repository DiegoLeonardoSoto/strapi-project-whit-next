import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { NEXT_PUBLIC_STRAPI_BASE_URL } from "./lib/strapi";

const protectedRoutes = ["/dashboard"];

function checkIsProtectedRoute(path: string): boolean {
  return protectedRoutes.some((route) => path.startsWith(route));
}

export async function proxy(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  const isProtected = checkIsProtectedRoute(currentPath);

  if (!isProtected) return NextResponse.next();

  // If the route is protected, check for the JWT cookie

  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    //1. validate if the user has a JWT cookie
    if (!jwt) {
      return NextResponse.redirect(new URL("/signIn", request.url));
    }

    const response = await fetch(
      `${NEXT_PUBLIC_STRAPI_BASE_URL}/api/users/me`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      },
    );

    const userResponse = await response.json();

    console.log(userResponse);

    //2. If user exists
    if (!userResponse) {
      return NextResponse.redirect(new URL("/signIn", request.url));
    }

    //3. if user is active

    // allow access to the protected route
    return NextResponse.next();
  } catch (error) {
    console.log("Error verifying user authentication:", error);

    return NextResponse.redirect(new URL("/signIn", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
