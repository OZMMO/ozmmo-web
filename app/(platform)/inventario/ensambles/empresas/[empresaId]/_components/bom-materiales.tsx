"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Layers, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
 import {
  type BatchSelectionConfig,
  defaultBatchSelectionConfig,
  type BatchSwitchEvent,
  findBestBatch,
  shouldSwitchBatch,
   mapEstadoLote,
 } from "./utils/batch-selection"
// import BatchMonitor from "./batch-monitor"
import { MaterialProducto } from "@/lib/db/almacen/lista_materiales_producto/material_producto"
import { Lote } from "@/lib/db/almacen/lotes/lote"
import BatchMonitor from "./batch-monitor"

export default function BomMateriales({
  productId,
  bodegaId,
  productMaterials
}: {
  productId: number
    bodegaId: number
  productMaterials: MaterialProducto[]
}) {
  const [materials, setMaterials] = useState<MaterialProducto[]>([])
  const [materialLotes, setMaterialLotes] = useState<Record<number, Lote[]>>({})
  const [selectedLotes, setSelectedLotes] = useState<Record<number, Lote | null>>({})
  const [selectedLoteScores, setSelectedLoteScores] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [expandedMaterials, setExpandedMaterials] = useState<Record<number, boolean>>({})
  const [batchSelectionConfig, setBatchSelectionConfig] = useState<BatchSelectionConfig>(defaultBatchSelectionConfig)
  const [switchEvents, setSwitchEvents] = useState<BatchSwitchEvent[]>([])
  const [showMonitor, setShowMonitor] = useState(false)

  // Use refs to track if we need to evaluate batches
  const needsEvaluation = useRef(false)
  const materialLotesRef = useRef(materialLotes)
  materialLotesRef.current = materialLotes

  // Función para evaluar y seleccionar el mejor lote para cada material
  const evaluateBestBatches = useCallback(() => {
    if (!materials.length) return

    const newSelectedLotes: Record<number, Lote | null> = {}
    const newSelectedLoteScores: Record<number, number> = {}
    const newSwitchEvents: BatchSwitchEvent[] = [...switchEvents]

    let hasChanges = false

    materials.forEach((material) => {
      const lotes = materialLotes[material.producto_id] || []
      const currentSelectedLote = selectedLotes[material.producto_id] || null
      const currentScore = selectedLoteScores[material.producto_id] || 0

      const { batch: bestBatch, score: bestScore } = findBestBatch(lotes, material, bodegaId, batchSelectionConfig)

      // Determinar si se debe cambiar el lote
      if (
        batchSelectionConfig.autoSwitch &&
        shouldSwitchBatch(currentSelectedLote, bestBatch, currentScore, bestScore, batchSelectionConfig)
      ) {
        hasChanges = true

        // Registrar el evento de cambio
        if (currentSelectedLote) {
          newSwitchEvents.unshift({
            timestamp: new Date(),
            materialId: material.producto_id,
            materialName: material.producto || `Material ${material.producto_id}`,
            previousBatchId: currentSelectedLote.id,
            newBatchId: bestBatch?.id || 0,
            previousBatchScore: currentScore,
            newBatchScore: bestScore,
            reason: "Lote más óptimo disponible",
          })
        }

        newSelectedLotes[material.producto_id] = bestBatch
        newSelectedLoteScores[material.producto_id] = bestScore
      } else if (!currentSelectedLote && bestBatch) {
        // Primera selección (sin evento de cambio)
        hasChanges = true
        newSelectedLotes[material.producto_id] = bestBatch
        newSelectedLoteScores[material.producto_id] = bestScore
      } else {
        // Mantener la selección actual
        newSelectedLotes[material.producto_id] = currentSelectedLote
        newSelectedLoteScores[material.producto_id] = currentScore
      }
    })

    // Only update state if there are changes to avoid infinite loops
    if (hasChanges) {
      setSelectedLotes(newSelectedLotes)
      setSelectedLoteScores(newSelectedLoteScores)

      if (newSwitchEvents.length > switchEvents.length) {
        setSwitchEvents(newSwitchEvents)
      }
    }

    // Reset the evaluation flag
    needsEvaluation.current = false
  }, [materials,  bodegaId,  batchSelectionConfig, switchEvents, selectedLotes, selectedLoteScores])
  //

  // Cargar materiales y lotes iniciales
  useEffect(() => {
    const fetchMateriales = async () => {
      setLoading(true)
      // const productMaterials = MATERIALES[productId] || []
      setMaterials(productMaterials)

      // Obtener lotes para cada material
      const lotesPorMaterial: Record<number, Lote[]> = {}
      for (const material of productMaterials || []) {
        const lots = await fetch(`/api/almacen/productos-disponibles?bodega_id=${bodegaId}&producto_id=${material.producto_id}&cantidad_minima=${material.cantidad_necesaria}`).then(res => res.json());
        lotesPorMaterial[material.producto_id] = lots;
      }
      // productMaterials.forEach((material) => {
      //   lotesPorMaterial[material.producto_id] = LOTES[material.producto_id] || []
      // })
      setMaterialLotes(lotesPorMaterial)

      // Initialize expanded state
      const expanded: Record<number, boolean> = {}
      productMaterials.forEach((material) => {
        expanded[material.id] = false
      })
      setExpandedMaterials(expanded)

      // Reset selected lotes
      setSelectedLotes({})
      setSelectedLoteScores({})
      setSwitchEvents([])

      // Set flag to evaluate batches after loading
      needsEvaluation.current = true
      setLoading(false)
    }
    fetchMateriales()
   
  }, [productId])

  // Evaluar los mejores lotes cuando cambian los materiales o lotes
  useEffect(() => {
    if (!loading && materials.length > 0 && needsEvaluation.current) {
      evaluateBestBatches()
    }
  }, [loading, materials, needsEvaluation, evaluateBestBatches])

  // Set flag to evaluate batches when materialLotes changes
  useEffect(() => {
    if (!loading && materials.length > 0) {
      needsEvaluation.current = true

      // Use a timeout to avoid immediate re-evaluation which could cause infinite loops
      const timer = setTimeout(() => {
        if (needsEvaluation.current) {
          evaluateBestBatches()
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [materialLotes, loading, materials.length, evaluateBestBatches])

  // Effect for config changes
  useEffect(() => {
    if (!loading && materials.length > 0) {
      needsEvaluation.current = true
    }
  }, [loading, materials.length])

  const toggleExpand = (materialId: number) => {
    setExpandedMaterials((prev) => ({
      ...prev,
      [materialId]: !prev[materialId],
    }))
  }

  const getStatusIcon = (status: "Activo" | "Bloqueado" | "Consumido" | "Vencido" | "Dañado") => {
    switch (status) {
      case "Activo":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case "Bloqueado":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "Consumido":
        return <AlertCircle className="h-4 w-4 text-rose-500" />
      case "Vencido":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "Dañado":
        return <AlertCircle className="h-4 w-4 text-rose-500" />
    }
  }

  const getStatusText = (status: "Activo" | "Bloqueado" | "Consumido" | "Vencido" | "Dañado") => {
    switch (status) {
      case "Activo":
        return "Disponible"
      case "Bloqueado":
        return "Reservado"
      case "Consumido":
        return "Agotado"
      case "Vencido":
        return "Vencido"
      case "Dañado":
        return "Dañado"
    }
  }

  const handleManualBatchSelect = (materialId: number, batch: Lote) => {
    const material = materials.find((m) => m.producto_id === materialId)
    if (!material) return

    const currentBatch = selectedLotes[materialId]
    if (currentBatch?.id === batch.id) return

    // Calculate scores for logging
    const { score: newScore } = findBestBatch([batch], material, bodegaId, batchSelectionConfig)

    const currentScore = selectedLoteScores[materialId] || 0

    // Register the manual switch event
    setSwitchEvents((prev) => [
      {
        timestamp: new Date(),
        materialId: materialId,
        materialName: material.producto || `Material ${materialId}`,
        previousBatchId: currentBatch?.id || 0,
        newBatchId: batch.id,
        previousBatchScore: currentScore,
        newBatchScore: newScore,
        reason: "Selección manual",
      },
      ...prev,
    ])

    // Update selected batch
    setSelectedLotes((prev) => ({
      ...prev,
      [materialId]: batch,
    }))

    setSelectedLoteScores((prev) => ({
      ...prev,
      [materialId]: newScore,
    }))
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Lista de Materiales (BOM)
          </h2>
          <label htmlFor="">Generar ensamble</label>
          <Badge
            onClick={() => setShowMonitor(!showMonitor)}
            className="cursor-pointer bg-white/20 hover:bg-white/30 text-white"
          >
            {switchEvents.length} cambios
          </Badge>
        </div>

        <Card className="rounded-t-none border-t-0 max-h-[1800px] overflow-y-auto">
          <CardContent className="p-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {materials.map((material) => {
                  const lotes = materialLotes[material.producto_id] || []
                  const selectedLote = selectedLotes[material.producto_id]
                  const selectedScore = selectedLoteScores[material.producto_id] || 0

                  return (
                    <div key={material.id} className="rounded-xl overflow-hidden">
                      <div
                        className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 cursor-pointer"
                        onClick={() => toggleExpand(material.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-slate-800">{material.producto}</h3>
                              {/* <Badge variant="outline" className="bg-white/50">
                                {material.producto_id}
                              </Badge> */}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              Cantidad requerida: {material.cantidad_necesaria} {material.unidad_medida}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedLote && (
                              <div className="flex items-center gap-1 text-xs bg-white/80 px-2 py-1 rounded">
                                <span>Lote seleccionado:</span>
                                <Badge variant="outline" className="bg-green-50">
                                  {selectedLote.codigo_lote}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  ({(selectedScore * 100).toFixed(0)}%)
                                </span>
                              </div>
                            )}
                            <Badge
                              className={`
                                ${
                                  lotes.some(
                                    (lot) =>
                                      mapEstadoLote(lot.estado_lote_id) === "Activo" &&
                                      (lot.cantidad_disponible || 0) > 0,
                                  )
                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                    : "bg-rose-100 text-rose-700 hover:bg-rose-100"
                                }
                              `}
                            >
                              {lotes.some(
                                (lot) =>
                                  mapEstadoLote(lot.estado_lote_id) === "Activo" &&
                                  (lot.cantidad_disponible || 0) > 0,
                              )
                                ? "En Stock"
                                : "Sin Stock"}
                            </Badge>
                            {expandedMaterials[material.id] ? (
                              <ChevronUp className="h-5 w-5 text-amber-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-amber-500" />
                            )}
                          </div>
                        </div>
                      </div>

                      {expandedMaterials[material.id] && (
                        <div className="p-4 bg-white border-x border-b border-amber-100 rounded-b-xl">
                          <h4 className="font-medium text-slate-700 mb-2">Lotes Disponibles:</h4>
                          <div className="space-y-3">
                            {lotes.map((lote) => {
                              const status = mapEstadoLote(lote.estado_lote_id)
                              const isSelected = selectedLote?.id === lote.id

                              return (
                                <div
                                  key={lote.id}
                                  className={`
                                    p-3 rounded-lg border cursor-pointer
                                    ${
                                      isSelected
                                        ? "border-blue-300 bg-blue-50"
                                        : status === "Activo"
                                          ? "border-emerald-200 bg-emerald-50"
                                          : status === "Bloqueado"
                                            ? "border-amber-200 bg-amber-50"
                                            : "border-slate-200 bg-slate-50"
                                    }
                                    ${isSelected ? "" : "hover:border-blue-200 hover:bg-blue-50/50"}
                                  `}
                                  onClick={() => handleManualBatchSelect(material.producto_id, lote)}
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="font-medium flex items-center gap-2">
                                      {lote.codigo_lote}
                                      {isSelected && (
                                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                          Seleccionado
                                        </Badge>
                                      )}
                                    </div>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="flex items-center gap-1">
                                            {getStatusIcon(status)}
                                            <span className="text-sm">{getStatusText(status)}</span>
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{getStatusText(status)}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                    <div className="text-slate-500">
                                      Fecha de vencimiento:{" "}
                                      <span className="text-slate-700">
                                        {lote.fecha_expiracion
                                          ? new Date(lote.fecha_expiracion).toLocaleDateString()
                                          : "N/A"}
                                      </span>
                                    </div>
                                    <div className="text-slate-500">
                                      Cantidad:{" "}
                                      <span className="text-slate-700">
                                        {lote.cantidad_disponible} {material.unidad_medida}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Barra de puntuación para este lote */}
                                  {(() => {
                                    const { score } = findBestBatch([lote], material, bodegaId, batchSelectionConfig)
                                    return (
                                      <div className="mt-2">
                                        <div className="flex justify-between items-center text-xs mb-1">
                                          <span>Puntuación:</span>
                                          <span>{(score * 100).toFixed(0)}%</span>
                                        </div>
                                        <Progress value={score * 100} className="h-1" />
                                      </div>
                                    )
                                  })()}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showMonitor && (
        <BatchMonitor
          switchEvents={switchEvents}
          config={batchSelectionConfig}
          onConfigChange={setBatchSelectionConfig}
        />
      )}
    </div>
  )
}

