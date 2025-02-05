import NextAuth, { type DefaultSession } from "next-auth";

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
}

declare module '@nodecfdi/cfdiutils-core' {
  export * from '@nodecfdi/cfdiutils-core/dist/types';
}
