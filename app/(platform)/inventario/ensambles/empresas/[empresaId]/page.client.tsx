"use client"

import { Bodega } from "@/lib/db/almacen/bodegas/bodega";
import { Productos } from "@/lib/db/almacen/productos/productos";
import { Empresa } from "@/lib/db/catalogos/empresas/empresa";
import { useState } from "react";
import SeleccionarProducto from "./_components/seleccionar-producto";
import SeleccionarBodega from "./_components/seleccionar-bodega";
import { Ensamble, ProductoAEnsamblar } from "@/lib/db/almacen/inventario/ensamble";
import BomMateriales from "./_components/bom-materiales";

interface EmpresaPageClientProps {
  empresaSeleccionada: Empresa;
  productos: Productos[];
}

export default function EmpresaPageClient({ empresaSeleccionada, productos }: EmpresaPageClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<Productos | null>(null)
  const [selectedWarehouse, setSelectedWarehouse] = useState<Bodega | null>(null)
  const [ensambles, setEnsambles] = useState<Ensamble[]>([]);
  
  const [isLoadingProductoAEnsamblar, setIsLoadingProductoAEnsamblar] = useState(false);
  const [productoAEnsamblar, setProductoAEnsamblar] = useState<ProductoAEnsamblar>();

  const generarEnsamble = async (producto_id: number) => {
    const ensamble = await fetch(`/api/almacen/generar-ensamble?producto_id=${producto_id}`).then(res => res.json());
    return ensamble;
  }

  const handleProductSelect = async (product: Productos) => {
    setIsLoadingProductoAEnsamblar(true);
    setSelectedProduct(product)
    const ensamble = await generarEnsamble(product.id);
    console.log({ensamble});
    setEnsambles(ensamble.ensambles);
    setProductoAEnsamblar(ensamble.productoAEnsamblar);
    setSelectedWarehouse(null) // Reset warehouse when product changes
    setIsLoadingProductoAEnsamblar(false);
  }

  const handleWarehouseSelect = (warehouse: Bodega) => {
    setSelectedWarehouse(warehouse)
  }

  const resetSelections = () => {
    setSelectedWarehouse(null)
    setSelectedProduct(null)
  }
  
  return (
    <div className="min-h-screen min-w-screen overflow-hidden relative">
      <div className="flex flex-col gap-4">

        <h1>{empresaSeleccionada.nombre_comercial}</h1>
        <header className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 inline-block">
            Sistema de Línea de Producción
          </h1>
        </header>
        <div className={`grid gap-4 ${selectedProduct && selectedWarehouse ? 'grid-cols-1 lg:grid-cols-12' : (selectedProduct ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1')}`}>
          <div className={`${selectedProduct && selectedWarehouse ? 'lg:col-span-3' : selectedProduct ? 'lg:col-span-1' : 'w-full'}`}>
            <SeleccionarProducto
              productos={productos}
              onSelectProduct={handleProductSelect}
              selectedProduct={selectedProduct}
              resetSelections={resetSelections}
              productoAEnsamblar={productoAEnsamblar || null}
              isLoadingProductoAEnsamblar={isLoadingProductoAEnsamblar}
            />
          </div>

          {selectedProduct && (
            <div className={`${selectedWarehouse ? 'lg:col-span-3' : 'lg:col-span-1'}`}>
              <SeleccionarBodega
                empresaId={empresaSeleccionada.id}
                productId={selectedProduct.id}
                onSelectWarehouse={handleWarehouseSelect}
                selectedWarehouse={selectedWarehouse}
              />
            </div>
          )}

          {selectedProduct && selectedWarehouse && (
            <div className="lg:col-span-6">
              <BomMateriales productId={selectedProduct.id} bodegaId={selectedWarehouse.id} productMaterials={selectedProduct.materiales || []} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}