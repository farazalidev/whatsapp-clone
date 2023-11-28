import { NextResponse, type NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // public paths
  // const isPublicPath = path === '/auth/login' || path === '/auth/register';

  // // validation refresh token
  // const refreshToken =
  //   request.cookies?.get(process.env.NEXT_PUBLIC_REFRESH_TOKEN_NAME)?.value ||
  //   '';
  // const decodedRefreshToken = refreshToken ? jwtDecode(refreshToken) : '';
  // const isValidRefreshToken = (decodedRefreshToken as any)?.exp
  //   ? (decodedRefreshToken as any)?.exp > Date.now() / 1000
  //   : false;

  // if (!isPublicPath && !isValidRefreshToken) {
  //   return NextResponse.redirect(new URL('/auth/login', request.url));
  // } else if (isPublicPath && isValidRefreshToken) {
  //   return NextResponse.redirect(new URL('/user', request.url));
  // }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/user/:path*', '/auth/:path*'],
};
