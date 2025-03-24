"use server";

import * as z from 'zod';
import { LoginSchema } from '../_schemas/index';

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  const result = await signIn("credentials", {
    email: values.email,
    password: values.password,
    redirect: true,
    redirectTo: callbackUrl || "/dashboard",
  })

  return result;
  // return {
  //   error: "",
  //   success: "",
  //   twoFactor: false
  // }
};

import { signIn, signOut } from "@/auth";

export const logout = async () => {
  await signOut();
};
