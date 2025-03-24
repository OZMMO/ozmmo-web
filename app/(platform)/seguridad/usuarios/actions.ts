"use server";

import { ActionState } from "@/components/crud";
import { UserModel, User } from "@/lib/db/security/user.model";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hash } from 'bcrypt';
import { randomBytes } from 'crypto';
import { sendInvitationEmail } from "@/lib/email";

const userSchema = z.object({
  UserId: z.string(),
  Email: z.string().email(),
  // PasswordHash: z.string(),
  FirstName: z.string(),
  SecondName: z.string().optional(),
  LastNameFather: z.string(),
  LastNameMother: z.string().optional(),
  RoleId: z.string().optional(),
  ImageUrl: z.string().optional(),
  IsActive: z.boolean().default(true),
  InvitationToken: z.string().optional(),
  InvitationTokenExpires: z.date().optional(),
});

export async function createUsuario(userData: User): Promise<ActionState<User>> {
  try {
    const validation = userSchema.safeParse(userData);
    if (!validation.success) {
      const validationError = new Error("Datos de usuario inválidos");
      validationError.name = "ValidationError";
      (validationError as any).details = validation.error.format();
      return { error: validationError };
    }
    
    // Generar una contraseña temporal aleatoria
    const tempPassword = randomBytes(16).toString('hex');
    const hashedPassword = await hash(tempPassword, 10);
    
    // Generar un token de invitación
    const invitationToken = randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 48); // El token expira en 48 horas

    const userModel = new UserModel();
    const result = await userModel.create({
      ...userData,
      PasswordHash: hashedPassword,
      InvitationToken: invitationToken,
      InvitationTokenExpires: tokenExpiry
    });

    // Enviar email de invitación
    const invitationUrl = `${process.env.NEXTAUTH_URL}/invite?token=${invitationToken}`;
    await sendInvitationEmail({
      to: userData.Email,
      name: userData.FirstName,
      invitationUrl,
      tempPassword,
    });
    
    revalidatePath("/seguridad/usuarios");
    return { data: result };
  } catch (error: any) {
    console.error("Error al crear usuario:", error);
    const actionError = new Error(error.message || "Error al crear usuario");
    actionError.name = "ActionError";
    if (error.details) {
      (actionError as any).details = error.details;
    }
    return { error: actionError };
  }
}

export async function updateUsuario(userData: User): Promise<ActionState<User>> {
  try {
    const validation = userSchema.safeParse(userData);
    
    if (!validation.success) {
      const validationError = new Error("Datos de usuario inválidos");
      validationError.name = "ValidationError";
      (validationError as any).details = validation.error.format();
      return { error: validationError };
    }
    
    const userModel = new UserModel();
    const result = await userModel.update(userData);
    
    revalidatePath("/seguridad/usuarios");
    return { data: result };
  } catch (error: any) {
    console.error("Error al actualizar usuario:", error);
    const actionError = new Error(error.message || "Error al actualizar usuario");
    actionError.name = "ActionError";
    if (error.details) {
      (actionError as any).details = error.details;
    }
    return { error: actionError };
  }
}

export async function deleteUsuario(user: User): Promise<ActionState<User>> {
  try {
    const userModel = new UserModel();
    const result = await userModel.delete(user.UserId);
    
    revalidatePath("/seguridad/usuarios");
    return { data: result };
  } catch (error: any) {
    console.error("Error al eliminar usuario:", error);
    const actionError = new Error(error.message || "Error al eliminar usuario");
    actionError.name = "ActionError";
    return { error: actionError };
  }
} 