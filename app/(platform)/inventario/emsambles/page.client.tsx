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
import { Lote } from "@/lib/db/almacen/lotes/lote";
import { Bodega } from "@/lib/db/almacen/bodegas/bodega";
import { Empresa } from "@/lib/db/catalogos/empresas/empresa";

interface EmsamblesPageClientProps {
  productos: Productos[];
  bodegas: Bodega[];
  empresas: Empresa[];
}

const lots: Lote[] = [
  { id: 1, codigo_lote: "LOT-001", producto_id: 1, page: 1, pageSize: 10 },
  { id: 2, codigo_lote: "LOT-002", producto_id: 2, page: 1, pageSize: 10 },
  { id: 3, codigo_lote: "LOT-003", producto_id: 3, page: 1, pageSize: 10 },
]

export default function EmsamblesPageClient({ productos, bodegas, empresas }: EmsamblesPageClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<Productos>()
  const [selectedLots, setSelectedLots] = useState<Record<number, number>>({})
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa>();
  const [filteredBodegas, setFilteredBodegas] = useState<Bodega[]>([]);
  const [selectedBodega, setSelectedBodega] = useState<Bodega | null>(null);

  useEffect(() => {
    if (selectedEmpresa) {
      setFilteredBodegas(bodegas.filter(bodega => bodega.empresa_id === selectedEmpresa.id));
    } else {
      setFilteredBodegas([]);
    }
  }, [selectedEmpresa, bodegas]);

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productos.find(p => p.id.toString() === productId) || undefined)
    setSelectedLots({})
  }

  const handleLotSelect = (componentId: number, lotId: number) => {
    setSelectedLots((prev) => ({ ...prev, [componentId]: lotId }))
  }

  const handleAssembly = () => {
    // Aquí iría la lógica para procesar el ensamblaje
    console.log("Ensamblaje completado", { selectedProduct, selectedLots })
  }

  const handleEmpresaSelect = (empresaId: string) => {
    setSelectedEmpresa(empresas.find(e => e.id.toString() === empresaId) || undefined);
    setSelectedProduct(undefined);
    setSelectedLots({});
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
          <Select onValueChange={handleProductSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione un producto" />
            </SelectTrigger>
            <SelectContent>
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
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Lote</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedProduct?.materiales?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.producto}</TableCell>
                    <TableCell>{item.cantidad_necesaria}</TableCell>
                    <TableCell>
                      <Select onValueChange={(value) => handleLotSelect(item.producto_id, Number(value))}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccione un lote" />
                        </SelectTrigger>
                        <SelectContent>
                          {lots.map((lot) => (
                            <SelectItem key={lot.id} value={lot.id.toString()}>
                              {lot.codigo_lote}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

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