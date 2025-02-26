"use client"

import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableHead, TableHeader } from "@/components/ui/table";
import { TableBody, TableRow } from "@/components/ui/table";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Productos } from "@/lib/db/almacen/productos/productos";
import { useState, useEffect } from "react";
import { Select } from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { Lote } from "@/lib/db/almacen/lotes/lote";
import { Empresa } from "@/lib/db/catalogos/empresas/empresa";
import { Bodega } from "@/lib/db/almacen/bodegas/bodega";
import { Skeleton } from "@/components/ui/skeleton";
import { Ensamble, ProductoAEnsamblar } from "@/lib/db";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { createEnsamble } from "./_actions";

interface EmsamblesPageClientProps {
  productos: Productos[];
  bodegas: Bodega[];
  empresas: Empresa[];
}

export default function EmsamblesPageClient({ productos, bodegas, empresas }: EmsamblesPageClientProps) {
  const { data: session } = useSession();
  const UserId = session?.user?.id || "";

  const [selectedProduct, setSelectedProduct] = useState<Productos>()
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa>();
  const [filteredBodegas, setFilteredBodegas] = useState<Bodega[]>([]);
  const [selectedBodega, setSelectedBodega] = useState<Bodega | null>(null);
  const [productLots, setProductLots] = useState<Record<number, Lote[]>>({});
  const [ensambles, setEnsambles] = useState<Ensamble[]>([]);

  const [productoAEnsamblar, setProductoAEnsamblar] = useState<ProductoAEnsamblar>();
  const [isLoadingProductoAEnsamblar, setIsLoadingProductoAEnsamblar] = useState(false);
  const [isLoadingLotes, setIsLoadingLotes] = useState(false);


  useEffect(() => {
    if (selectedEmpresa) {
      setFilteredBodegas(bodegas.filter(bodega => bodega.empresa_id === selectedEmpresa.id));
    } else {
      setFilteredBodegas([]);
    }
  }, [selectedEmpresa, bodegas]);

  const handleEmpresaSelect = (empresaId: string) => {
    setSelectedEmpresa(empresas.find(e => e.id.toString() === empresaId) || undefined);
    // setSelectedProduct({ id: 0, codigo: "", codigo_proveedor: "", descripcion: "", page: 1, pageSize: 10, materiales: [] });
    setSelectedProduct(undefined);
    setEnsambles([]);
  };

  const generarEnsamble = async (producto_id: number) => {
    const ensamble = await fetch(`/api/almacen/generar-ensamble?producto_id=${producto_id}`).then(res => res.json());
    return ensamble;
  }

  const handleProductSelect = async (productId: string) => {
    const selectedProduct = productos.find((p) => p.id.toString() === productId) || undefined;
    
    if (selectedProduct) {
      setSelectedProduct(selectedProduct);
      // setEnsambles([]);
      setIsLoadingProductoAEnsamblar(true);
      const ensamble = await generarEnsamble(selectedProduct.id);
      console.log({ensamble});
      setEnsambles(ensamble.ensambles);
      setProductoAEnsamblar(ensamble.productoAEnsamblar);
      setIsLoadingProductoAEnsamblar(false);
      // setEnsambles((selectedProduct.materiales || []).map((material) => ({
      //   ensamble_id: 0,
      //   producto_id: material.producto_id,
      //   producto: material.producto || "",
      //   cantidad: material.cantidad_necesaria,
      //   unidad_medida_id: material.unidad_medida_id,
      //   unidad_medida: material.unidad_medida || "",
      //   lote_id: 0,
      // })));

      setIsLoadingLotes(true);
      const materialLots: Record<number, Lote[]> = {};
      for (const material of selectedProduct.materiales || []) {
        const lots = await fetch(`/api/almacen/productos-disponibles?bodega_id=${selectedBodega?.id}&producto_id=${material.producto_id}&cantidad_minima=${material.cantidad_necesaria}`).then(res => res.json());
        materialLots[material.producto_id] = lots;
      }
      setProductLots(materialLots);
      setIsLoadingLotes(false);
    } else {
      setProductLots({});
      setSelectedProduct(undefined);
      setEnsambles([]);
      setIsLoadingLotes(false);
      setIsLoadingProductoAEnsamblar(false);
    }
  };

  const handleLotSelectEnsamble = (productoId: number, lotId: number) => {
    setEnsambles((prev) => prev.map((item) => item.producto_id === productoId ? { ...item, lote_id: lotId } : item));
  }

  const handleAssembly = async () => {
    // Aquí iría la lógica para procesar el ensamblaje
    console.log("Ensamblaje completado", { selectedProduct, ensambles })
    const result = await createEnsamble({
      producto_id: selectedProduct?.id || 0,
      numero_serie: productoAEnsamblar?.numero_serie || "",
      notas: "",
      detalle_ensamble: ensambles,
      UserId: UserId
    })
    console.log({result});
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ensamblaje de Productos</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Seleccionar Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleEmpresaSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione una empresa" />
            </SelectTrigger>
            <SelectContent>
              {empresas.map((empresa) => (
                <SelectItem key={empresa.id} value={empresa.id.toString()}>
                  {empresa.rfc}-{empresa.razon_social}- Total Bodegas: {bodegas.filter(b => b.empresa_id === empresa.id).length}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedEmpresa && filteredBodegas.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Seleccionar Bodega</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {filteredBodegas.map((bodega) => (
              <div key={bodega.id} className={`border p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 ${selectedBodega?.id === bodega.id ? 'bg-blue-100 dark:bg-blue-900' : ''}`} onClick={() => setSelectedBodega(bodega)}>
                <h3 className="text-lg font-semibold dark:text-gray-100">{bodega.codigo}</h3>
                <p className="dark:text-gray-300">{bodega.descripcion}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Seleccionar Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            onValueChange={handleProductSelect}
            value={selectedProduct?.id ? selectedProduct.id.toString() : "0"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione un producto"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Seleccione un producto</SelectItem>
              {productos.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.codigo}-{product.descripcion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {isLoadingProductoAEnsamblar ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <div className="flex justify-center">
            <Spinner className="h-8 w-8 animate-spin" />
          </div>
        </div>
      ) : (
        productoAEnsamblar && (
          <Card className="mb-6">
          <CardHeader>
            <CardTitle>Producto a Ensamblar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[120px]">Nuevo Numero de Serie:</span>
                <span className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-md font-mono text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">{productoAEnsamblar.numero_serie}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(productoAEnsamblar.numero_serie);
                    toast.info("Numero de serie copiado al portapapeles");
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                  title="Copiar número de serie"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[120px]">Producto:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">{productoAEnsamblar.producto}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[120px]">Descripción:</span>
                <span className="text-purple-700 dark:text-purple-400">{productoAEnsamblar.descripcion}</span>
              </div>
            </div>
          </CardContent>
          </Card>
        )
      )}

      {selectedProduct && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Lista de Materiales (BOM)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Componente</TableHead>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead>Unidad de Medida</TableHead>
                  <TableHead>Lote</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ensambles.map((item) => (
                  <TableRow key={item.producto_id}>
                    <TableCell>{item.producto}</TableCell>
                    <TableCell className="text-center">{item.cantidad_necesaria}</TableCell>
                    <TableCell>{item.unidad_medida}</TableCell>
                    <TableCell>
                      {isLoadingLotes ? (
                        <Skeleton className="h-6 w-full" />
                      ) : (
                        <Select onValueChange={(value) => handleLotSelectEnsamble(item.producto_id, Number(value))}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione un lote" />
                          </SelectTrigger>
                          <SelectContent>
                            {productLots[item.producto_id]?.map((lot) => (
                              <SelectItem key={lot.id} value={lot.id.toString()}>
                                Código: {lot.codigo_lote} <br />
                                Cantidad Disponible: {lot.cantidad_disponible}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* <pre><code>{JSON.stringify(selectedProduct?.materiales, null, 2)}</code></pre> */}
      <pre><code>{JSON.stringify(ensambles, null, 2)}</code></pre>

      <h2 className="text-lg font-semibold mb-2">Lote de destino del ensamble</h2>

      <Button
        onClick={handleAssembly}
        // disabled={!selectedProduct || Object.keys(selectedLots).length !== boms[selectedProduct]?.length}
      >
        Completar Ensamblaje
      </Button>
    </div>
  );
}