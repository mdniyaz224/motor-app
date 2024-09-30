import { NextResponse } from 'next/server';
// List of protected routes
const protectedRoutes = ['/dashboard'];

export function middleware(req) {
  // Assuming the JWT is stored in a cookie called 'auth-token'
  const token = req.cookies.get('auth-token')?.value;

  // Check if the request is for a protected route
  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    // If the token is not found (i.e., the user is not logged in), redirect to the login page
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // If the token exists or the route is not protected, continue
  return NextResponse.next();
}

// Configuring the middleware to apply to specific routes or globally
export const config = {
  matcher: ['/dashboard/:path*'], // Apply middleware to these paths
};
