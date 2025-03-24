import { auth } from "@/auth";
import { authenticateUser } from "@/lib/auth/credentials-auth";
import { UserModel } from "@/lib/db/security/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  const authUserId = session?.user?.id;

  const email = request.nextUrl.searchParams.get('email');
  const password = request.nextUrl.searchParams.get('password');

  if (!email || !password) {
    return NextResponse.json({ error: "Email y password son requeridos" }, { status: 400 });
  }

  console.log({email, password})
  const user = await authenticateUser(email as string, password as string);
  return NextResponse.json(user);
}