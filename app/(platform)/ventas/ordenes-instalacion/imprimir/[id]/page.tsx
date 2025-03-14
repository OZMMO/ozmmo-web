"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Printer, ArrowLeft, AlertCircle } from "lucide-react";
import { OrdenInstalacion } from "@/lib/db";
export default function ImprimirOrdenPage() {
  const params = useParams();
  const router = useRouter();
  const [orden, setOrden] = useState<OrdenInstalacion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // En un caso real, estas serían llamadas a API
        // Simulamos datos para el ejemplo
        await Promise.all([fetchOrden(Number(params.id))]);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const fetchOrden = async (id: number) => {
    // Simular llamada a API
    const orden = await fetch(`/api/ventas/ordenes-instalacion?id=${id}`).then(
      (res) => res.json()
    );
    setOrden(orden.data[0]);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleVolver = () => {
    router.push("/ventas/ordenes-instalacion");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-lg">Cargando orden de instalación...</p>
      </div>
    );
  }

  if (!orden) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="mt-4 text-lg">No se encontró la orden de instalación</p>
        <Button className="mt-4" onClick={handleVolver}>
          Volver a órdenes
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-6 print:hidden">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={handleVolver}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" /> Imprimir
          </Button>
        </div>
      </div>

      <div className="container mx-auto py-6 print:p-0 print:max-w-full">
        <div className="bg-white p-8 rounded-lg border print:border-0 print:p-0 print:shadow-none">
          <div className="text-center border-b pb-4 mb-6">
            <h1 className="text-2xl font-bold uppercase">
              Orden de Instalación
            </h1>
            <p className="text-xl mt-2">{orden.codigo}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold border-b pb-2 mb-3">
                Información General
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Cliente:</span>{" "}
                  {orden.cliente_razon_social}
                </p>
                <p>
                  <span className="font-medium">Pedido:</span>{" "}
                  {orden.pedido_codigo}
                </p>
                <p>
                  <span className="font-medium">Estado:</span>{" "}
                  {orden.estatus_ordenes_instalacion}
                </p>
                <p>
                  <span className="font-medium">Fecha y hora:</span>{" "}
                  {orden.FechaHoraInstalacion?.toLocaleString() || "No especificada"}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold border-b pb-2 mb-3">
                Detalles de Instalación
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Instalador:</span>{" "}
                  {orden.instalador_nombre_completo}
                </p>
                <p>
                  <span className="font-medium">Notas:</span>{" "}
                  {orden.Notas || "Sin notas"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">
              Dirección de Instalación
            </h2>
            {orden.direccion ? (
              <div className="space-y-1">
                <p>
                  {orden.direccion.calle} {orden.direccion.numero_exterior}
                  {orden.direccion.numero_interior
                    ? `, Int. ${orden.direccion.numero_interior}`
                    : ""}
                </p>
                <p>Col. {orden.direccion.colonia}</p>
                <p>
                  {orden.direccion.municipio}, {orden.direccion.estado}
                </p>
                <p>C.P. {orden.direccion.codigo_postal}</p>
              </div>
            ) : (
              <p>No hay dirección registrada</p>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold border-b pb-2 mb-3">
              Productos a Instalar
            </h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Producto</th>
                  <th className="border p-2 text-left">Cantidad</th>
                  <th className="border p-2 text-left">Tipo</th>
                  <th className="border p-2 text-left">Ensamble/Lote</th>
                  <th className="border p-2 text-left">Número de Serie</th>
                  <th className="border p-2 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {orden.detalles?.map((detalle) => (
                  <tr key={detalle.id}>
                    <td className="border p-2">{detalle.producto}</td>
                    <td className="border p-2">{detalle.cantidad}</td>
                    <td className="border p-2">
                      {detalle.es_ensamble ? "Ensamble" : "Producto individual"}
                    </td>
                    <td className="border p-2">
                      {detalle.es_ensamble ? detalle.ensamble : "N/A"}
                    </td>
                    <td className="border p-2">{detalle?.ensamble || "N/A"}</td>
                    <td className="border p-2">
                      {detalle.surtido ? "Surtido" : "Pendiente"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-12 mt-16 print:mt-24">
            <div className="text-center">
              <div className="border-t border-black pt-2">
                <p>Firma de Entrega</p>
                <p className="text-sm text-gray-600">Nombre y Fecha</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-black pt-2">
                <p>Firma de Recepción</p>
                <p className="text-sm text-gray-600">Nombre y Fecha</p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mt-12 print:mt-16">
            <p>Documento generado el {new Date().toLocaleString()}</p>
            <p>
              Esta orden de instalación es un documento oficial de la empresa.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: portrait;
            margin: 1cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </>
  );
}
