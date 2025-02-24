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

interface EmsamblesPageClientProps {
  productos: Productos[];
  bodegas: Bodega[];
  empresas: Empresa[];
}

interface DetalleEnsamblaje {
  ensamble_id: number;
  producto_id: number;
  producto: string;
  cantidad: number;
  unidad_medida_id: number;
  unidad_medida: string;
  lote_id: number;
}

export default function EmsamblesPageClient({ productos, bodegas, empresas }: EmsamblesPageClientProps) {
  const { data: session } = useSession();
  const UserId = session?.user?.email || "";

  const [selectedProduct, setSelectedProduct] = useState<Productos>()
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa>();
  const [filteredBodegas, setFilteredBodegas] = useState<Bodega[]>([]);
  const [selectedBodega, setSelectedBodega] = useState<Bodega | null>(null);
  const [productLots, setProductLots] = useState<Record<number, Lote[]>>({});
  const [ensambles, setEnsambles] = useState<DetalleEnsamblaje[]>([]);

  const [isLoadingLotes, setIsLoadingLotes] = useState(false);


  useEffect(() => {
    if (selectedEmpresa) {
      setFilteredBodegas(bodegas.filter(bodega => bodega.empresa_id === selectedEmpresa.id));
    } else {
      setFilteredBodegas([]);
    }
  }, [selectedEmpresa, bodegas]);

  const handleProductSelect = async (productId: string) => {
    const selectedProduct = productos.find((p) => p.id.toString() === productId) || undefined;
    setSelectedProduct(selectedProduct);
    setEnsambles([]);

    if (selectedProduct) {
      setEnsambles((selectedProduct.materiales || []).map((material) => ({
        ensamble_id: 0,
        producto_id: material.producto_id,
        producto: material.producto || "",
        cantidad: material.cantidad_necesaria,
        unidad_medida_id: material.unidad_medida_id,
        unidad_medida: material.unidad_medida || "",
        lote_id: 0,
      })));

      setIsLoadingLotes(true);
      const materialLots: Record<number, Lote[]> = {};
      for (const material of selectedProduct.materiales || []) {
        const lots = await fetch(`/api/almacen/productos-disponibles?bodega_id=${selectedBodega?.id}&producto_id=${material.producto_id}&cantidad_minima=${material.cantidad_necesaria}`).then(res => res.json());
        materialLots[material.producto_id] = lots;
      }
      setProductLots(materialLots);
      setIsLoadingLotes(false);
    } else {
      setIsLoadingLotes(false);
    }
  };

  const handleLotSelectEnsamble = (productoId: number, lotId: number) => {
    setEnsambles((prev) => prev.map((item) => item.producto_id === productoId ? { ...item, lote_id: lotId } : item));
  }

  const handleAssembly = () => {
    // Aquí iría la lógica para procesar el ensamblaje
    console.log("Ensamblaje completado", { selectedProduct, ensambles })
  }

  const handleEmpresaSelect = (empresaId: string) => {
    setSelectedEmpresa(empresas.find(e => e.id.toString() === empresaId) || undefined);
    // setSelectedProduct({ id: 0, codigo: "", codigo_proveedor: "", descripcion: "", page: 1, pageSize: 10, materiales: [] });
    setSelectedProduct(undefined);
    setEnsambles([]);
  };

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
                    <TableCell className="text-center">{item.cantidad}</TableCell>
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