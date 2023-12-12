import { NextResponse, NextRequest } from 'next/server';
// import { jwtDecode } from 'jwt-decode';

export async function middleware(request: NextRequest) {
  // const path = request.nextUrl.pathname;

  // public paths
  // const isPublicPath = path === '/auth/login' || path === '/auth/register' || path === '/auth/otp';

  // validation refresh token
  // const refreshToken = request.cookies?.get(process.env.NEXT_PUBLIC_REFRESH_TOKEN_NAME)?.value || '';
  // const decodedRefreshToken = refreshToken ? jwtDecode(refreshToken) : '';
  // const isValidRefreshToken = (decodedRefreshToken as any)?.exp ? (decodedRefreshToken as any)?.exp > Date.now() / 1000 : false;

  // if (!isPublicPath && !isValidRefreshToken) {
  //     // Redirect to login page or handle unauthorized access
  //     return NextResponse.redirect(new URL('/auth/login', request.url));
  // }

  // Continue to the next middleware or route handler
  return NextResponse.next();
}

export const config = {
  matcher: ['/user/:path*', '/auth/:path*'],
};
