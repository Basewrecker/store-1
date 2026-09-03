import NextAuth from 'next-auth';
import authConfig from '@/auth.config';

// Build the middleware from the lightweight, Edge-safe config only.
// Importing the full @/auth here would pull in the Prisma adapter and its
// Node.js built-ins, which the Edge Runtime cannot load.
export const { auth: middleware } = NextAuth(authConfig);
