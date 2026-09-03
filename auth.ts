import NextAuth, { type NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from './db/prisma';
import Credentials from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import authConfig from './auth.config';
import { cookies } from "next/headers";
import { NextResponse } from 'next/server';


// Full config: pulls in Prisma (Node.js only). Only import this from Node.js
// contexts (server actions, route handlers) — never from middleware.ts.
export const config = {
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        if (user && user.password) {
          const isMatch = compareSync(credentials.password as string, user.password);
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        // if user doesn't exist
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub;

      if (trigger == 'update') {
        session.user.name = user.name;
      }

      return session
    },
    async jwt({ token, user, trigger, session }:any) {
      if (user) {
        token.role = user.role;
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];

          await prisma.user.update({
            where: {
              id: user.id
            },
              data: {name: token.name}
          })
        }
      }
      return token;
    },
    authorized({ request, auth }: any) {
      if (!request.cookies.get('sessionCartId')) {
        const sessionCardId = crypto.randomUUID();
        const newRequestHeaders = new Headers(request.headers);
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders
          }
        })
        response.cookies.set('sessionCartId', sessionCardId);
      } else {
        return true;
      }
    }
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
