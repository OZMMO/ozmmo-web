"use client"

import { useEffect, useState } from "react"
import { Store, MapPin, BarChart3, Package, Calendar, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Ubicacion } from "@/lib/db/almacen/ubicaciones/ubicaciones"
import { Bodega } from "@/lib/db/almacen/bodegas/bodega"
import { CircleButton } from "./circleb-button"
import { tryCatch } from "@/lib/try-catch"
import { Lote } from "@/lib/db/almacen/lotes/lote"
import { Badge } from "@/components/ui/badge"
import { EstadoLoteEnum } from "@/lib/db/almacen/estados-lote/estado-lote"

// Función auxiliar para calcular la disponibilidad
const calcularDisponibilidad = (bodega: Bodega) => {
  const capacidadTotal = bodega.ubicaciones?.reduce((total: number, ub: Ubicacion) => total + (ub.capacidad_maxima || 0), 0) || 0
  const capacidadOcupada = bodega.ubicaciones?.reduce((total: number, ub: Ubicacion) => total + (ub.ocupado || 0), 0) || 0
  
  const capacidadDisponible = capacidadTotal - capacidadOcupada
  const porcentajeOcupado = capacidadTotal > 0 ? (capacidadOcupada / capacidadTotal) * 100 : 0
  
  return { 
    capacidad: capacidadTotal,
    disponible: capacidadDisponible,
    porcentaje: porcentajeOcupado
  }
}

// Función para obtener los lotes de una bodega
const getLotesFromBodega = (bodega: Bodega): Lote[] => {
  if (!bodega.ubicaciones) return []
  
  const lotes: Lote[] = []
  bodega.ubicaciones.forEach(ubicacion => {
    if (ubicacion.lotes && ubicacion.lotes.length > 0) {
      ubicacion.lotes.forEach(lote => {
        if (lote.estado_lote_id === EstadoLoteEnum.ACTIVO && lote.cantidad_disponible && lote.cantidad_disponible > 0) {
          lotes.push({
            ...lote,
            ubicacion: ubicacion
          })
        }
      })
    }
  })
  
  return lotes
}

export default function SeleccionarBodega({
  empresaId,
  productId,
  onSelectWarehouse,
  selectedWarehouse,
  onSelectLoteDestino,
  selectedLoteDestino,
}: {
  empresaId: number
  productId: number
  onSelectWarehouse: (warehouse: Bodega | null) => void
  selectedWarehouse: Bodega | null
  onSelectLoteDestino: (lote: Lote | null) => void
  selectedLoteDestino: Lote | null
}) {
  const [warehouses, setWarehouses] = useState<Bodega[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedWarehouse, setExpandedWarehouse] = useState<string | null>(null)

  const fetchBodegas = async () => {
    const response = await fetch(`/api/almacen/bodegas?empresaId=${empresaId}&productoId=${productId}&soloActivos=true`)
    const data = await response.json()
    return data
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const {error, data} = await tryCatch<Bodega[], Error>(fetchBodegas())
      console.log({data})
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

  const handleSelectLote = (lote: Lote, warehouse: Bodega) => {
    onSelectLoteDestino(lote)
    onSelectWarehouse(warehouse)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date))
  }

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
                const { capacidad, disponible, porcentaje: availabilityPercentage } = calcularDisponibilidad(warehouse)
                // const availabilityPercentage = (disponible / capacidad) * 100
                const lotes = getLotesFromBodega(warehouse)
                const hasLotes = lotes.length > 0

                return (
                  <div key={warehouse.id} className="hover:scale-[1.01] transition-transform cursor-pointer"
                    onClick={() => {
                      setExpandedWarehouse(expandedWarehouse === `warehouse-${warehouse.id}` ? null : `warehouse-${warehouse.id}`)
                    }}
                  >
                    <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        {/* <button 
                          className="text-left"
                          onClick={() => {
                            setExpandedWarehouse(expandedWarehouse === `warehouse-${warehouse.id}` ? null : `warehouse-${warehouse.id}`)
                          }}
                        >
                          <h3 className="font-medium text-slate-800">{warehouse.descripcion}</h3>
                        </button> */}
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
                      {Math.round(availabilityPercentage)}%

                      <Progress value={availabilityPercentage} className="h-2" />

                      {expandedWarehouse === `warehouse-${warehouse.id}` && (
                        <div className="mt-4 border-t pt-3">
                          <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                            <Package className="h-4 w-4 mr-1" />
                            Lotes disponibles
                          </h4>
                          
                          {hasLotes ? (
                            <div className="space-y-2">
                              {lotes.map(lote => (
                                <div 
                                  key={lote.id} 
                                  className="p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                                  onClick={() => handleSelectLote(lote, warehouse)}
                                >
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm">{lote.codigo_lote}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {lote.cantidad_disponible} unidades
                                    </Badge>
                                  </div>
                                  
                                  {lote.fecha_expiracion && (
                                    <div className="flex items-center text-xs text-slate-500">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      Expira: {formatDate(lote.fecha_expiracion)}
                                    </div>
                                  )}
                                  
                                  {lote.ubicacion && (
                                    <div className="flex items-center text-xs text-slate-500 mt-1">
                                      <Tag className="h-3 w-3 mr-1" />
                                      Ubicación: {lote.ubicacion?.codigo}-{lote.ubicacion?.descripcion}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-slate-500 py-2">
                              No hay lotes disponibles en esta bodega
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-800">{selectedWarehouse.descripcion}</h3>
                <CircleButton color="cyan" onClick={() => {
                  onSelectWarehouse(null)
                  onSelectLoteDestino(null)
                }}>
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
                        {disponible}% / {capacidad}
                      </span>
                    </div>

                    <Progress value={(disponible / capacidad) * 100} className="h-3 mb-4" />
                  </>
                )
              })()}

              {selectedLoteDestino && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
                    <Package className="h-4 w-4 mr-1" />
                    Lote seleccionado
                  </h4>
                  
                  <div className="p-3 rounded-lg border border-cyan-200 bg-cyan-50">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">{selectedLoteDestino.codigo_lote}</span>
                      <Badge variant="outline" className="bg-white">
                        {selectedLoteDestino.cantidad_disponible} unidades
                      </Badge>
                    </div>
                    
                    {selectedLoteDestino.fecha_expiracion && (
                      <div className="flex items-center text-sm text-slate-600 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Expira: {formatDate(selectedLoteDestino.fecha_expiracion)}
                      </div>
                    )}
                    
                    {selectedLoteDestino.ubicacion && (
                      <div className="flex items-center text-sm text-slate-600 mt-1">
                        <Tag className="h-4 w-4 mr-1" />
                        Ubicación: {selectedLoteDestino.ubicacion.descripcion}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

