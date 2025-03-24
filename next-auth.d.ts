import NextAuth, { type DefaultSession, DefaultUser } from "next-auth";

interface UserRole {
  role: string = "ADMIN" | "SOPORTE" | "DESARROLLADOR" | "IMPLEMENTADOR"
}

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  // isTwoFactorEnabled: boolean;
  // isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }

  interface User extends DefaultUser {
    role?: string
  }
}
