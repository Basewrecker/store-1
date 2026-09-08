import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

// Edge-safe slice of the auth config. No database adapter and no Node-only
// providers live here, so this module is safe to import from middleware.ts
// (Edge Runtime). auth.ts spreads this as its base for Node.js contexts.
export default {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [],
  callbacks: {
    authorized({ request, auth }: any) {
      // Guest cart tracking: issue a sessionCartId cookie to any visitor that
      // doesn't have one. cart.actions.ts (addItemToCart / getMyCart) reads
      // this cookie and throws "Cart session not found" without it. This is
      // the only place that runs in middleware, so the cookie must be set here.
      if (!request.cookies.get('sessionCartId')) {
        const sessionCartId = crypto.randomUUID();
        const newRequestHeaders = new Headers(request.headers);
        const response = NextResponse.next({
          request: { headers: newRequestHeaders },
        });
        response.cookies.set('sessionCartId', sessionCartId);
        return response;
      }
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
