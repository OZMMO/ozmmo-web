import NextAuth, { Account, Profile, User } from "next-auth"
import { AdapterUser } from '@auth/core/adapters';
import authConfig from "@/auth.config"
import { MSSQLServerAdapter } from "./lib/db";
 
interface SingInProps {
  user: AdapterUser;
  account: Account | null;
  profile?: Profile;
  email?: {
      verificationRequest?: boolean;
  };
  credentials?: Record<string, any>;
}
export const { 
    handlers: { GET, POST },
    auth,
    handlers, 
    signIn, 
    signOut,
  } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      // await db.user.update({
      //   where: { id: user.id },
      //   data: { emailVerified: new Date() }
      // })
    }
  },
  callbacks: {
    async jwt({token, user}) {
      
      return token
   },
    async signIn({ 
        user,
        account, 
        profile 
      }: {
        user?: User | null,
        account?: Account | null,
        profile?: Profile | undefined
      }): Promise<boolean> {
        // console.log({user, account, profile})  
      // if (account?.provider === "google") {
      //   return profile?.email_verified && profile?.email?.endsWith("@adagio.com.mx") ? true : false;
      // }

      return true // Do different verification for other providers that don't have `email_verified`
    },
    async session({ session, token }) {
      if (token) {
        session.userId = token.sub as string;
        session.user.id = token.sub as string;
      }
      // if (user) {
      //   session.user.id = user.id;
      //   session.user.image = user.image // Asegúrate de que el campo image se incluya en la sesión
      // }
        
      return session
    },
  },
  adapter: MSSQLServerAdapter(),
  session: { strategy: "jwt" },
  ...authConfig,
})