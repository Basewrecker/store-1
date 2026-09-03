import NextAuth from 'next-auth';
import authConfig from '@/auth.config';

// Build the middleware from the lightweight, Edge-safe config only.
// Importing the full @/auth here would pull in the Prisma adapter and its
// Node.js built-ins, which the Edge Runtime cannot load.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Don't run the auth check on Next internals, the image optimizer, or static
  // assets. Without this, unauthenticated requests for those paths — including
  // the image optimizer's own cookieless fetch of /images/* — get redirected
  // to /sign-in, which breaks next/image with a 400 "not a valid image".
  matcher: ['/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
