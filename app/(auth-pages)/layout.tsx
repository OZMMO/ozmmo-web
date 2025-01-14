import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col gap-12 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>OZMMO</Link>
              {/* <div className="flex items-center gap-2">
                <DeployButton />
              </div> */}
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
          </div>
        </nav>
      <div className="flex flex-col gap-12 items-center">{children}</div>
    </main>
  );
}
