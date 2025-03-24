"use server"

import { Resend } from "resend"
import InvitationEmail from "@/components/emails/invitation-email"

// Inicializar Resend con la API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Interfaz para los datos de la invitación
interface InvitationEmailData {
  to: string
  name: string
  invitationUrl: string
  tempPassword: string
}

// Función para enviar email de invitación usando Resend con componente React
export async function sendInvitationEmail({ to, name, invitationUrl, tempPassword }: InvitationEmailData) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.EMAIL_FROM_NAME || "Sistema"} <${process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"}>`,
      to: [to],
      subject: "Invitación a la plataforma",
      react: InvitationEmail({ name, invitationUrl, tempPassword }),
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

