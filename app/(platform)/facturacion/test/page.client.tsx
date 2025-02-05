"use client";
import { CRUD, Column } from "@/components/crud";
import { useEffect, useState } from "react";
import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { simularFactura } from "@/lib/facturacion/facturacion";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { Bodega } from '@/lib/db/catalogos/bodega.model';
// import { Empresa } from '@/lib/db/catalogos/empresa.model';

interface PageProps {}

export interface FacturacionInfoExtra {}

export default function FacturacionClientPage() {
  //const { data, totalCount, totalPages } = payload;
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const handleGenerateFactura = () => {
    console.log("Generando factura");

    simularFactura();
  };

  return (
    <>
      <h1>Facturacion</h1>
      <Button onClick={handleGenerateFactura}>Generar Factura</Button>
    </>
  );
}
