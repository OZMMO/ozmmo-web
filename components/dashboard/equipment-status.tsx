"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  { name: "Filtros", operativo: 80, mantenimiento: 20 },
  { name: "Bombas", operativo: 65, mantenimiento: 35 },
  { name: "Tanques", operativo: 90, mantenimiento: 10 },
  { name: "Medidores", operativo: 75, mantenimiento: 25 },
  { name: "Válvulas", operativo: 85, mantenimiento: 15 },
]

export function EquipmentStatus() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Estado de Equipos</CardTitle>
        <CardDescription>Distribución de equipos operativos y en mantenimiento</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              formatter={(value) => [`${value}%`]}
            />
            <Legend />
            <Bar 
              dataKey="operativo" 
              name="Operativo"
              stackId="a" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="mantenimiento" 
              name="Mantenimiento"
              stackId="a" 
              fill="#EAB308"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
