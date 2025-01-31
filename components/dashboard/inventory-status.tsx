"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"
import { Badge } from "@/components/ui/badge"

const data = [
  { name: "Disponible", value: 150, color: "#3B82F6" },  // Colores modernos
  { name: "Rentado", value: 80, color: "#22C55E" },
  { name: "Mantenimiento", value: 15, color: "#EAB308" },
]

const total = data.reduce((acc, item) => acc + item.value, 0)

export function InventoryStatus() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold">Estado del Inventario</CardTitle>
        <CardDescription className="text-lg">
          Total de equipos: <span className="font-semibold">{total}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div style={{ backgroundColor: item.color }} className="h-4 w-4 rounded-full" />
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {item.value}
                  </Badge>
                  <span className="text-sm font-medium text-muted-foreground w-12">
                    {Math.round((item.value / total) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
