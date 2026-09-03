import type { NextAuthConfig } from 'next-auth';

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
    authorized({ auth }: any) {
      return !!auth?.user;
    },
  },
} satisfies NextAuthConfig;
