'use server'

import { UserModel } from '@/lib/db/security/user.model';
import { hash } from 'bcrypt';
import { z } from 'zod';

// Configu
// Función para validar el token de invitación
export async function validateInvitationToken(token: string) {
  try {
    const user = await new UserModel().findUnique({ InvitationToken: token })
    
    if (!user) {
      return { valid: false, message: "Token de invitación no encontrado" };
    }
    
    const now = new Date();
    
    if (!user.InvitationTokenExpires) {
      return { valid: false, message: "La invitación no tiene fecha de expiración" };
    }
    
    const expiryDate = new Date(user.InvitationTokenExpires);
    
    if (now > expiryDate) {
      return { valid: false, message: "El token de invitación ha expirado" };
    }
    
    return {
      valid: true,
      id: user.UserId,
      name: user.FirstName,
      email: user.Email
    };
  } catch (error) {
    console.error('Error al validar token de invitación:', error);
    return { valid: false, message: "Error al validar la invitación" };
  } 
}

// Esquema de validación para la aceptación de invitación
const acceptInvitationSchema = z.object({
  token: z.string(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Función para aceptar la invitación y establecer la contraseña
export async function acceptInvitation(data: z.infer<typeof acceptInvitationSchema>) {
  try {
    const { token, password } = acceptInvitationSchema.parse(data);
    
    // Validar el token
    const validation = await validateInvitationToken(token);
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }
    
    // Hashear la nueva contraseña
    const hashedPassword = await hash(password, 10);
    
    // Actualizar el usuario
    const user = await new UserModel().findUnique({ InvitationToken: token })
    if (!user) {
      return { success: false, message: "Usuario no encontrado" };
    }
    
    await new UserModel().update({
      ...user,
      PasswordHash: hashedPassword,
      InvitationToken: undefined,
      InvitationTokenExpires: undefined
    })
    
    return { success: true };
  } catch (error) {
    console.error('Error al aceptar invitación:', error);
    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }
    return { success: false, message: "Error al procesar la invitación" };
  }
}

