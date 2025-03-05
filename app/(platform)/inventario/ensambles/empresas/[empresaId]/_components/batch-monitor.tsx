"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BatchSelectionCriteria,
  type BatchSelectionConfig,
  defaultBatchSelectionConfig,
  type BatchSwitchEvent,
} from "./utils/batch-selection"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Activity, Settings, RotateCcw, Clock, AlertTriangle } from "lucide-react"

interface BatchMonitorProps {
  switchEvents: BatchSwitchEvent[]
  config: BatchSelectionConfig
  onConfigChange: (config: BatchSelectionConfig) => void
}

export default function BatchMonitor({ switchEvents, config, onConfigChange }: BatchMonitorProps) {
  const [activeTab, setActiveTab] = useState("events")

  const handleWeightChange = useCallback(
    (criteria: BatchSelectionCriteria, value: number[]) => {
      const newWeights = { ...config.weights, [criteria]: value[0] / 100 }
      onConfigChange({ ...config, weights: newWeights })
    },
    [config, onConfigChange],
  )

  const handleAutoSwitchChange = useCallback(
    (checked: boolean) => {
      onConfigChange({ ...config, autoSwitch: checked })
    },
    [config, onConfigChange],
  )

  const handleMinScoreDiffChange = useCallback(
    (value: number[]) => {
      onConfigChange({ ...config, minimumScoreDifference: value[0] / 100 })
    },
    [config, onConfigChange],
  )

  const resetConfig = useCallback(() => {
    onConfigChange(defaultBatchSelectionConfig)
  }, [onConfigChange])

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Monitor de Lotes
          </CardTitle>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="events" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Eventos</span>
              </TabsTrigger>
              <TabsTrigger value="config" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Configuración</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="events" className="mt-0">
            {switchEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mb-4 text-amber-500" />
                <p>No hay eventos de cambio de lote registrados.</p>
                <p className="text-sm mt-2">
                  Los eventos aparecerán aquí cuando el sistema cambie automáticamente entre lotes.
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hora</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Lote Anterior</TableHead>
                      <TableHead>Nuevo Lote</TableHead>
                      <TableHead>Razón</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {switchEvents.map((event, index) => (
                      <TableRow key={index}>
                        <TableCell className="whitespace-nowrap">{event.timestamp.toLocaleTimeString()}</TableCell>
                        <TableCell>{event.materialName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline">{event.previousBatchId}</Badge>
                            <span className="text-xs text-muted-foreground">
                              ({(event.previousBatchScore * 100).toFixed(0)}%)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="bg-green-50">
                              {event.newBatchId}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              ({(event.newBatchScore * 100).toFixed(0)}%)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{event.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="config" className="mt-0">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Configuración de Selección de Lotes</h3>
                <button
                  onClick={resetConfig}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <RotateCcw className="h-3 w-3" />
                  Restablecer
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-switch">Cambio Automático</Label>
                    <div className="text-sm text-muted-foreground">Habilitar cambio automático de lotes</div>
                  </div>
                  <Switch id="auto-switch" checked={config.autoSwitch} onCheckedChange={handleAutoSwitchChange} />
                </div>

                <div className="space-y-2">
                  <Label>Diferencia Mínima para Cambio ({(config.minimumScoreDifference * 100).toFixed(0)}%)</Label>
                  <Slider
                    value={[config.minimumScoreDifference * 100]}
                    min={5}
                    max={50}
                    step={5}
                    onValueChange={handleMinScoreDiffChange}
                  />
                  <div className="text-xs text-muted-foreground">
                    La puntuación del nuevo lote debe ser al menos este porcentaje mejor para activar un cambio
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Pesos de Criterios</Label>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Fecha de Vencimiento</Label>
                        <span className="text-sm">
                          {(config.weights[BatchSelectionCriteria.EXPIRATION_DATE] * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Slider
                        value={[config.weights[BatchSelectionCriteria.EXPIRATION_DATE] * 100]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={(value) => handleWeightChange(BatchSelectionCriteria.EXPIRATION_DATE, value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Disponibilidad</Label>
                        <span className="text-sm">
                          {(config.weights[BatchSelectionCriteria.AVAILABILITY] * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Slider
                        value={[config.weights[BatchSelectionCriteria.AVAILABILITY] * 100]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={(value) => handleWeightChange(BatchSelectionCriteria.AVAILABILITY, value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Estado</Label>
                        <span className="text-sm">
                          {(config.weights[BatchSelectionCriteria.STATUS] * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Slider
                        value={[config.weights[BatchSelectionCriteria.STATUS] * 100]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={(value) => handleWeightChange(BatchSelectionCriteria.STATUS, value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Ubicación</Label>
                        <span className="text-sm">
                          {(config.weights[BatchSelectionCriteria.LOCATION] * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Slider
                        value={[config.weights[BatchSelectionCriteria.LOCATION] * 100]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={(value) => handleWeightChange(BatchSelectionCriteria.LOCATION, value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

