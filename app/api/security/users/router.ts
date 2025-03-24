import { auth } from "@/auth";
import { UserModel } from "@/lib/db/security/user.model";
import { NextResponse } from "next/server";

export default async function GET(request: Request) {
  const session = await auth();
  const authUserId = session?.user?.id;

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const userId = searchParams.get("userId");

  if (!userId && !email) {
    return NextResponse.json({ error: "User Id o email son requeridos" }, { status: 400 });
  }

  const user = await new UserModel().findUnique({ UserId: userId as string, Email: email as string });
  return NextResponse.json(user);
}