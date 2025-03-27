"use client";

import { useParams, useRouter } from "next/navigation";
import { ImprimirOrdenComponente } from "./page.imprimir";

export default function ImprimirOrdenPage() {
  const params = useParams();

  return (
    <div className="container mx-auto py-6 print:hidden">
      <ImprimirOrdenComponente id={Number(params.id)} origen="PAGE" />
    </div>
  )
}
