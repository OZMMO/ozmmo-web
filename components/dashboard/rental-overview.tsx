"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Ene", rentas: 40 },
  { name: "Feb", rentas: 45 },
  { name: "Mar", rentas: 55 },
  { name: "Abr", rentas: 60 },
  { name: "May", rentas: 70 },
  { name: "Jun", rentas: 75 },
  { name: "Jul", rentas: 80 },
  { name: "Ago", rentas: 85 },
  { name: "Sep", rentas: 90 },
  { name: "Oct", rentas: 95 },
  { name: "Nov", rentas: 100 },
  { name: "Dic", rentas: 110 },
]

export function RentalOverview() {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Resumen de Rentas</CardTitle>
        <CardDescription>Evolución mensual de rentas durante el año</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
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
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="rentas" 
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, style: { fill: '#3B82F6' } }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
