import { UserModel } from "@/lib/db/security/user.model";
import { UsuariosCRUD } from "./usuarios-crud";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleModel } from "@/lib/db/security/roles.model";
import { auth } from "@/auth";
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
  const session = await auth();
  const userId = session?.user.id as string;

  const userModel = new UserModel();
  const roleModel = new RoleModel();

  const promise = Promise.all([ 
    userModel.findMany({}),
    roleModel.findMany({UserId: userId})
  ])

  const [users, roles] = await promise;

  return <UsuariosCRUD initialUsers={users} initialRoles={roles} />;
}