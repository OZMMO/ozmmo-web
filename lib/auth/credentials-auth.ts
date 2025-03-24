"use server";

import { compare } from "bcrypt";
import { UserModel } from "../db/security/user.model";

export async function authenticateUser(email: string, password: string) {
  try {
    const userModel = new UserModel();
    const user = await userModel.findUnique({ Email: email });
    
    if (!user || !user.PasswordHash) return null;

    console.log(password, user.PasswordHash)
    
    const passwordsMatch = await compare(password, user.PasswordHash);
    
    if (passwordsMatch) {
      return {
        id: user.UserId,
        email: user.Email,
        name: `${user.FirstName} ${user.LastNameFather}`.trim(),
        image: user.ImageUrl || null,
        role: user.Role?.RoleId
      };
    }
  } catch (error) {
    console.error("Error during authentication:", error);
  }
  
  return null;
} 