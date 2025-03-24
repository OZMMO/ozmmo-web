import { redirect } from "next/navigation";
import { AcceptInvitationForm } from "@/components/accept-invitation-form";
import { validateInvitationToken } from "@/app/(platform)/seguridad/usuarios/invitation-actions";
export default async function InvitePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  if (!token) {
    redirect("/login");
  }

  // Validar el token de invitación
  const invitation = await validateInvitationToken(token);

  if (!invitation.valid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="w-full max-w-md">
          <div className="rounded-lg bg-red-50 p-6 text-center">
            <h1 className="text-xl font-bold text-red-800">Invitación inválida</h1>
            <p className="mt-2 text-red-700">
              {invitation.message || "El enlace de invitación no es válido o ha expirado."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Completar Registro</h1>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <p className="mb-4">
            Hola <strong>{invitation.name}</strong>, estás a un paso de completar tu registro.
          </p>
          <AcceptInvitationForm token={token} email={invitation.email || ""} />
        </div>
      </div>
    </div>
  );
}

