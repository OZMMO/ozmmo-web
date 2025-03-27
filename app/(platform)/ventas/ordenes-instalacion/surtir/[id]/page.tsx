"use client";

import { useParams } from "next/navigation";
import { SurtirOrdenInstalacionComponent } from "./page.surir";

export default function SurtirOrdenInstalacionPage() {
  const params = useParams();

  return (
    <div className="container mx-auto py-2 space-y-2">
      <SurtirOrdenInstalacionComponent id={Number(params.id)} origen="PAGE" />
    </div>
  )

}

