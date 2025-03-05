"use client"

import { useState } from "react"
import { Search, Package, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HexagonalButton } from "./hexagonal-button"
import { Productos } from "@/lib/db/almacen/productos/productos"
import { ProductoAEnsamblar } from "@/lib/db/almacen/inventario/ensamble"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

export default function SeleccionarProducto({
  productos,
  onSelectProduct,
  selectedProduct,
  resetSelections,
  productoAEnsamblar,
  isLoadingProductoAEnsamblar,
}: {
  productos: Productos[],
  onSelectProduct: (product: Productos) => void
  selectedProduct: Productos | null
  resetSelections: () => void
  productoAEnsamblar: ProductoAEnsamblar | null
  isLoadingProductoAEnsamblar: boolean
}) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = productos.filter(
    (product) =>
      product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codigo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 rounded-t-2xl flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Package className="h-5 w-5" />
          Selección de Producto
        </h2>
        {selectedProduct && (
          <Button variant="ghost" size="icon" onClick={resetSelections} className="text-white hover:bg-white/20">
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Card className="rounded-t-none border-t-0">
        <CardContent className="p-4">
          {!selectedProduct ? (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar producto por nombre o código..."
                  className="pl-8 bg-slate-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="hover:scale-[1.03] active:scale-[0.98] transition-transform">
                    <div
                      className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 cursor-pointer hover:shadow-md transition-all"
                      onClick={() => onSelectProduct(product)}
                    >
                      {/* <div className="w-16 h-16 mb-2 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                        <img
                          src={`/placeholder.svg?height=80&width=80&text=${product.codigo}`}
                          alt={product.descripcion}
                          className="w-12 h-12"
                        />
                      </div> */}
                      <h3 className="font-medium text-slate-800 text-center">{product.descripcion}</h3>
                      <span className="text-xs text-slate-500">{product.codigo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center p-4">
              {/* <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <img
                  src={`/placeholder.svg?height=80&width=80&text=${selectedProduct.codigo}`}
                  alt={selectedProduct.descripcion}
                  className="w-16 h-16"
                />
              </div> */}
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
                        {/* <button
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
                        </button> */}
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
              {/* <h3 className="text-xl font-bold text-slate-800">{selectedProduct.descripcion}</h3>
              <span className="text-sm text-slate-500 mb-4">{selectedProduct.codigo}</span> */}

              <HexagonalButton onClick={() => onSelectProduct(selectedProduct)}>Cambiar Producto</HexagonalButton>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

