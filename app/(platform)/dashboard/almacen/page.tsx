'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package2, 
  Warehouse, 
  BoxesIcon, 
  Truck, 
  BarChart3, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Package 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Datos de ejemplo
const dummyData = {
  kpis: {
    ocupacionTotal: 78.5,
    productosStock: 4589,
    recepcionesPendientes: 8,
    alertasStock: 12,
    tendenciaMensual: 15.4,
    rotacionInventario: 4.2
  },
  productos: [
    { id: 1, codigo: 'PROD-001', descripcion: 'Laptop Dell XPS', stock: 50, stockMin: 20, ubicacion: 'A-01-01', rotacion: 'Alta', ultimoMovimiento: '2025-02-17' },
    { id: 2, codigo: 'PROD-002', descripcion: 'Monitor LG 27"', stock: 30, stockMin: 15, ubicacion: 'A-01-02', rotacion: 'Media', ultimoMovimiento: '2025-02-16' },
    { id: 3, codigo: 'PROD-003', descripcion: 'Teclado Mecánico', stock: 100, stockMin: 50, ubicacion: 'A-02-01', rotacion: 'Baja', ultimoMovimiento: '2025-02-15' },
    { id: 4, codigo: 'PROD-004', descripcion: 'Mouse Inalámbrico', stock: 150, stockMin: 30, ubicacion: 'A-02-02', rotacion: 'Alta', ultimoMovimiento: '2025-02-18' }
  ],
  tendenciaStock: [
    { mes: 'Sep', valor: 3200 },
    { mes: 'Oct', valor: 3800 },
    { mes: 'Nov', valor: 3500 },
    { mes: 'Dic', valor: 4200 },
    { mes: 'Ene', valor: 4000 },
    { mes: 'Feb', valor: 4589 }
  ],
  distribucionInventario: [
    { name: 'Electrónicos', value: 45 },
    { name: 'Periféricos', value: 30 },
    { name: 'Accesorios', value: 15 },
    { name: 'Otros', value: 10 }
  ],
  stockData: [
    { name: 'Laptops', stock: 50, capacidad: 100 },
    { name: 'Monitores', stock: 30, capacidad: 80 },
    { name: 'Teclados', stock: 100, capacidad: 150 },
    { name: 'Mouse', stock: 150, capacidad: 200 }
  ],
  recepciones: [
    { id: 1, fecha: '2025-02-17', proveedor: 'Proveedor A', productos: 'Laptop Dell XPS, Monitor LG 27"', estado: 'Completada' },
    { id: 2, fecha: '2025-02-16', proveedor: 'Proveedor B', productos: 'Teclado Mecánico', estado: 'Pendiente' },
    { id: 3, fecha: '2025-02-15', proveedor: 'Proveedor C', productos: 'Mouse Inalámbrico', estado: 'Completada' },
    { id: 4, fecha: '2025-02-14', proveedor: 'Proveedor D', productos: 'Laptop Dell XPS, Teclado Mecánico', estado: 'Pendiente' }
  ],
  bodegas: [
    { codigo: 'BOD-001', descripcion: 'Bodega Principal', ubicaciones: 100, ocupacion: '75%' },
    { codigo: 'BOD-002', descripcion: 'Bodega Secundaria', ubicaciones: 50, ocupacion: '45%' }
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  trend: string;
  trendValue?: string; // Optional if not always used
  bgColor: string;
  iconColor: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, trend, trendValue, bgColor, iconColor }) => (
  <Card className={bgColor}>
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <Icon className={iconColor} />
      </div>
      <div className="mt-2 flex items-center text-sm text-green-600">
        <ArrowUpRight size={16} className="mr-1" />
        <span>{trend}</span>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-2 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard de Almacén</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Package2 size={16} />
            Nueva Recepción
          </Button>
          <Button variant="outline" className="gap-2">
            <BoxesIcon size={16} />
            Nuevo Movimiento
          </Button>
          <Button variant="outline" className="gap-2">
            <Search size={16} />
            Búsqueda Avanzada
          </Button>
        </div>
      </div>

      {/* KPIs Row */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <KPICard
          title="Ocupación Total"
          value={`${dummyData.kpis.ocupacionTotal}%`}
          icon={Warehouse}
          trend="+2.5%"
          bgColor="bg-blue-50"
          iconColor="text-blue-500"
        />
        <KPICard
          title="Productos en Stock"
          value={dummyData.kpis.productosStock}
          icon={Package}
          trend="+154"
          bgColor="bg-green-50"
          iconColor="text-green-500"
        />
        <KPICard
          title="Recepciones Pendientes"
          value={dummyData.kpis.recepcionesPendientes}
          icon={Truck}
          trend="Hoy"
          bgColor="bg-yellow-50"
          iconColor="text-yellow-500"
        />
        <KPICard
          title="Alertas de Stock"
          value={dummyData.kpis.alertasStock}
          icon={AlertTriangle}
          trend="+3"
          bgColor="bg-red-50"
          iconColor="text-red-500"
        />
        <KPICard
          title="Tendencia Mensual"
          value={`+${dummyData.kpis.tendenciaMensual}%`}
          icon={TrendingUp}
          trend="vs. Enero"
          bgColor="bg-purple-50"
          iconColor="text-purple-500"
        />
        <KPICard
          title="Rotación Inventario"
          value={dummyData.kpis.rotacionInventario}
          icon={BarChart3}
          trend="veces/mes"
          bgColor="bg-indigo-50"
          iconColor="text-indigo-500"
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="inventario">Inventario</TabsTrigger>
          <TabsTrigger value="recepciones">Recepciones</TabsTrigger>
          <TabsTrigger value="bodegas">Bodegas</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Stock</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dummyData.tendenciaStock}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="valor" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución del Inventario</CardTitle>
                <CardDescription>Por categoría de producto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dummyData.distribucionInventario}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dummyData.distribucionInventario.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventario">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Stock Mínimo</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Rotación</TableHead>
                  <TableHead>Último Movimiento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyData.productos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>{producto.codigo}</TableCell>
                    <TableCell>{producto.descripcion}</TableCell>
                    <TableCell>{producto.stock}</TableCell>
                    <TableCell>{producto.stockMin}</TableCell>
                    <TableCell>{producto.ubicacion}</TableCell>
                    <TableCell>{producto.rotacion}</TableCell>
                    <TableCell>{producto.ultimoMovimiento}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="recepciones">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyData.recepciones.map((recepcion) => (
                  <TableRow key={recepcion.id}>
                    <TableCell>{recepcion.id}</TableCell>
                    <TableCell>{recepcion.fecha}</TableCell>
                    <TableCell>{recepcion.proveedor}</TableCell>
                    <TableCell>{recepcion.productos}</TableCell>
                    <TableCell>{recepcion.estado}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="bodegas">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Ubicaciones</TableHead>
                  <TableHead>Ocupación (%)</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyData.bodegas.map((bodega) => (
                  <TableRow key={bodega.codigo}>
                    <TableCell>{bodega.codigo}</TableCell>
                    <TableCell>{bodega.descripcion}</TableCell>
                    <TableCell>{bodega.ubicaciones}</TableCell>
                    <TableCell>{bodega.ocupacion}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => alert(`Viewing locations for ${bodega.descripcion}`)}>
                        Ver Ubicaciones
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;