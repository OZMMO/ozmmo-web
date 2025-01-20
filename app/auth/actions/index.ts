"use server";

import * as z from 'zod';
import { LoginSchema } from '../_schemas/index';

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  return {
    error: "",
    success: "",
    twoFactor: false
  }
};

import { signOut } from "@/auth";

export const logout = async () => {
  await signOut();
};
