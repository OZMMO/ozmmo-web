"use server"

import { Resend } from "resend"
import { InvitationEmailCliente, InvitationEmailUser } from "@/components/emails/invitation-email"
import { User } from "./db/security/user.model"
import { RoleEnum } from "./db/security/roles.model"

// Inicializar Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Interfaz para los datos de la invitación
interface InvitationEmailData {
  user: User,
  invitationUrl: string
  tempPassword: string
}

// Función para enviar email de invitación usando Resend con componente React
export async function sendInvitationEmail({ user, invitationUrl, tempPassword }: InvitationEmailData) {
  try {
    const ReactCompEmail = user.RoleId === RoleEnum.CLIENTE ? InvitationEmailCliente : InvitationEmailUser;
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME || "Sistema"} <${process.env.RESEND_FROM_EMAIL || "onboarding@ozmmo.com"}>`,
      to: [user.Email],
      subject: "Bienvenido a la plataforma de Ozmmo",
      react: ReactCompEmail({ 
        name: user.FirstName, 
        role: user.Role?.Name || "Desconocido", 
        invitationUrl, 
        tempPassword 
      }),
    })

    if (error) {
      console.error("Error al enviar email con Resend:", error)
      throw new Error(error.message)
    }

    return { success: true, messageId: data?.id }
  } catch (error) {
    console.error("Error al enviar email de invitación:", error)
    throw new Error("No se pudo enviar el email de invitación")
  }
}

