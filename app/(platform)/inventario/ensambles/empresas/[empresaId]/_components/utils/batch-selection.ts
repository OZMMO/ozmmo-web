import { Lote } from "@/lib/db/almacen/lotes/lote"
import { MaterialProducto } from "@/lib/db/almacen/lista_materiales_producto/material_producto"

// Enum for batch selection criteria
export enum BatchSelectionCriteria {
  EXPIRATION_DATE = "expiration_date",
  AVAILABILITY = "availability",
  STATUS = "status",
  LOCATION = "location",
}

// Interface for batch selection configuration
export interface BatchSelectionConfig {
  criteria: BatchSelectionCriteria[]
  weights: Record<BatchSelectionCriteria, number>
  autoSwitch: boolean
  minimumScoreDifference: number
}

// Default configuration
export const defaultBatchSelectionConfig: BatchSelectionConfig = {
  criteria: [
    BatchSelectionCriteria.EXPIRATION_DATE,
    BatchSelectionCriteria.AVAILABILITY,
    BatchSelectionCriteria.STATUS,
    BatchSelectionCriteria.LOCATION,
  ],
  weights: {
    [BatchSelectionCriteria.EXPIRATION_DATE]: 0.3,
    [BatchSelectionCriteria.AVAILABILITY]: 0.3,
    [BatchSelectionCriteria.STATUS]: 0.3,
    [BatchSelectionCriteria.LOCATION]: 0.1,
  },
  autoSwitch: true,
  minimumScoreDifference: 0.2, // Minimum score difference to trigger a switch
}

// Interface for batch switch event
export interface BatchSwitchEvent {
  timestamp: Date
  materialId: number
  materialName: string
  previousBatchId: number
  newBatchId: number
  previousBatchScore: number
  newBatchScore: number
  reason: string
}

// Status mapping
export const mapEstadoLote = (estadoLoteId: number | undefined): "Activo" | "Bloqueado" | "Consumido" | "Vencido" | "Dañado" => {
  if (!estadoLoteId) return "Bloqueado"

  switch (estadoLoteId) {
    case 1:
      return "Activo"
    case 2:
      return "Bloqueado"
    case 3:
      return "Consumido" 
    case 4:
      return "Vencido"
    case 5:
      return "Dañado"
    default:
      return "Activo"
  }
}

// Function to score a batch based on criteria
export function scoreBatch(
  batch: Lote,
  material: MaterialProducto,
  warehouseId: number,
  config: BatchSelectionConfig,
): number {
  let totalScore = 0
  let totalWeight = 0

  // Score for expiration date
  if (config.criteria.includes(BatchSelectionCriteria.EXPIRATION_DATE) && batch.fecha_expiracion) {
    const daysUntilExpiration = Math.max(
      0,
      (new Date(batch.fecha_expiracion).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    )
    // Normalize to a 0-1 scale (assuming 2 years is the maximum shelf life)
    const expirationScore = Math.min(1, daysUntilExpiration / (365 * 2))
    totalScore += expirationScore * config.weights[BatchSelectionCriteria.EXPIRATION_DATE]
    totalWeight += config.weights[BatchSelectionCriteria.EXPIRATION_DATE]
  }

  // Score for availability
  if (config.criteria.includes(BatchSelectionCriteria.AVAILABILITY)) {
    const availabilityScore =
      batch.cantidad_disponible && batch.cantidad_inicial
        ? Math.min(1, batch.cantidad_disponible / batch.cantidad_inicial)
        : 0
    totalScore += availabilityScore * config.weights[BatchSelectionCriteria.AVAILABILITY]
    totalWeight += config.weights[BatchSelectionCriteria.AVAILABILITY]
  }

  // Score for status
  if (config.criteria.includes(BatchSelectionCriteria.STATUS)) {
    const status = mapEstadoLote(batch.estado_lote_id)
    const statusScore = status === "Activo" ? 1 : status === "Bloqueado" ? 0.5 : 0
    totalScore += statusScore * config.weights[BatchSelectionCriteria.STATUS]
    totalWeight += config.weights[BatchSelectionCriteria.STATUS]
  }

  // Score for location
  if (config.criteria.includes(BatchSelectionCriteria.LOCATION)) {
    const locationScore = batch.bodega_id === warehouseId ? 1 : 0
    totalScore += locationScore * config.weights[BatchSelectionCriteria.LOCATION]
    totalWeight += config.weights[BatchSelectionCriteria.LOCATION]
  }

  // Normalize the score
  return totalWeight > 0 ? totalScore / totalWeight : 0
}

// Function to find the best batch
export function findBestBatch(
  batches: Lote[],
  material: MaterialProducto,
  warehouseId: number,
  config: BatchSelectionConfig,
): { batch: Lote | null; score: number } {
  if (!batches || batches.length === 0) {
    return { batch: null, score: 0 }
  }

  let bestBatch: Lote | null = null
  let bestScore = -1

  for (const batch of batches) {
    const score = scoreBatch(batch, material, warehouseId, config)
    if (score > bestScore) {
      bestScore = score
      bestBatch = batch
    }
  }

  return { batch: bestBatch, score: bestScore }
}

// Function to determine if a batch switch is needed
export function shouldSwitchBatch(
  currentBatch: Lote | null,
  newBestBatch: Lote | null,
  currentScore: number,
  newScore: number,
  config: BatchSelectionConfig,
): boolean {
  if (!currentBatch || !newBestBatch) {
    return !!newBestBatch
  }

  if (currentBatch.id === newBestBatch.id) {
    return false
  }

  return newScore - currentScore >= config.minimumScoreDifference
}

