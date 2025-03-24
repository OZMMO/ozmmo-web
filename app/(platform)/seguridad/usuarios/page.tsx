import { UserModel } from "@/lib/db/security/user.model";
import { UsuariosCRUD } from "./usuarios-crud";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function UsuariosPage() {
  return (
    <div className="container py-6">
      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <UsuariosContent />
      </Suspense>
    </div>
  )
}

async function UsuariosContent() {
  const userModel = new UserModel();
  const users = await userModel.findMany({});

  return <UsuariosCRUD initialUsers={users} />;
}