"use client"

import { useEffect, useState } from "react"
import { Store, MapPin, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Ubicacion } from "@/lib/db/almacen/ubicaciones/ubicaciones"
import { Bodega } from "@/lib/db/almacen/bodegas/bodega"
import { CircleButton } from "./circleb-button"
import { tryCatch } from "@/lib/try-catch"

// Función auxiliar para calcular la disponibilidad
const calcularDisponibilidad = (bodega: Bodega) => {
  const capacidadTotal = bodega.ubicaciones?.reduce((total: number, ub: Ubicacion) => total + (ub.capacidad_maxima || 0), 0) || 0
  // Simulamos que el 75% de la capacidad está disponible
  const disponible = Math.floor(capacidadTotal * 0.75)
  return { capacidad: capacidadTotal, disponible }
}

export default function SeleccionarBodega({
  empresaId,
  productId,
  onSelectWarehouse,
  selectedWarehouse,
}: {
  empresaId: number
  productId: number
  onSelectWarehouse: (warehouse: Bodega) => void
  selectedWarehouse: Bodega | null
}) {
  const [warehouses, setWarehouses] = useState<Bodega[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBodegas = async () => {
    const response = await fetch(`/api/almacen/bodegas?empresaId=${empresaId}&productoId=${productId}&soloActivos=true`)
    const data = await response.json()
    return data
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const {error, data} = await tryCatch<Bodega[], Error>(fetchBodegas())

      if(error) {
        setLoading(false)

        console.error('Error fetching bodegas:', error)
      } else {
        setWarehouses(data)
        setLoading(false)
      }
    }

    fetchData()
  }, [productId])

  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 p-4 rounded-t-2xl">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Store className="h-5 w-5" />
          Bodegas Disponibles
        </h2>
      </div>

      <Card className="rounded-t-none border-t-0">
        <CardContent className="p-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            </div>
          ) : !selectedWarehouse ? (
            <div className="grid grid-cols-1 gap-3">
              {warehouses.map((warehouse) => {
                const { capacidad, disponible } = calcularDisponibilidad(warehouse)
                const availabilityPercentage = (disponible / capacidad) * 100
                const availabilityColor =
                  availabilityPercentage > 70
                    ? "bg-emerald-500"
                    : availabilityPercentage > 30
                      ? "bg-amber-500"
                      : "bg-rose-500"

                return (
                  <div key={warehouse.id} className="hover:scale-[1.02] active:scale-[0.98] transition-transform">
                    <div
                      className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 cursor-pointer hover:shadow-md transition-all"
                      onClick={() => onSelectWarehouse(warehouse)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-slate-800">{warehouse.descripcion}</h3>
                        <CircleButton
                          color="cyan"
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectWarehouse(warehouse)
                          }}
                        >
                          Seleccionar
                        </CircleButton>
                      </div>

                      <div className="flex items-center text-xs text-slate-500 mb-3">
                        <MapPin className="h-3 w-3 mr-1" />
                        {warehouse.sucursal?.nombre || "Sin ubicación"}
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">Disponibilidad:</span>
                        <span className="text-sm font-medium">
                          {disponible} / {capacidad}
                        </span>
                      </div>

                      <Progress value={availabilityPercentage} className="h-2" />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-800">{selectedWarehouse.descripcion}</h3>
                <CircleButton color="cyan" onClick={() => onSelectWarehouse(selectedWarehouse)}>
                  Cambiar
                </CircleButton>
              </div>

              <div className="flex items-center text-sm text-slate-500 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                {selectedWarehouse.sucursal?.nombre || "Sin ubicación"}
              </div>

              {(() => {
                const { capacidad, disponible } = calcularDisponibilidad(selectedWarehouse)
                return (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-slate-400" />
                      <span className="text-slate-600">Disponibilidad:</span>
                      <span className="font-medium">
                        {disponible} / {capacidad}
                      </span>
                    </div>

                    <Progress value={(disponible / capacidad) * 100} className="h-3" />
                  </>
                )
              })()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

