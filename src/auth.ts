import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import type { Adapter } from "next-auth/adapters" // <--- Import this

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Force cast the adapter to satisfy TypeScript
  adapter: PrismaAdapter(prisma) as Adapter, 
  providers: [GitHub],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    }
  }
})