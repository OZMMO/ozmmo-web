"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {  DetalleOrdenInstalacion, Productos } from "@/lib/db";
import { SelectValue } from "@/components/ui/select";
import { Select, SelectTrigger, SelectItem } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
interface DetalleOrdenInstalacionTableProps {
  detalles: DetalleOrdenInstalacion[];
  onDetallesChange: (detalles: DetalleOrdenInstalacion[]) => void;
  infoExtra?: {
    productos: Productos[];
  };
}

export function DetalleOrdenInstalacionTable({
  detalles,
  onDetallesChange,
  infoExtra,
}: DetalleOrdenInstalacionTableProps) {
  const [localDetalles, setLocalDetalles] = useState<DetalleOrdenInstalacion[]>(
    detalles
  );

  const handleAddRow = () => {
    const newDetalle: DetalleOrdenInstalacion = {
      id_producto: 0,
      cantidad: 0,
    };
    const updatedDetalles = [...localDetalles, newDetalle];
    setLocalDetalles(updatedDetalles);
    onDetallesChange(updatedDetalles);
  };

  const handleRemoveRow = (index: number) => {
    const updatedDetalles = localDetalles.filter((_, i) => i !== index);
    setLocalDetalles(updatedDetalles);
    onDetallesChange(updatedDetalles);
  };

  const handleChange = (
    index: number,
    field: keyof DetalleOrdenInstalacion,
    value: any
  ) => {
    const updatedDetalles = localDetalles.map((detalle, i) =>
      i === index ? { ...detalle, [field]: value } : detalle
    );
    setLocalDetalles(updatedDetalles);
    onDetallesChange(updatedDetalles);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localDetalles.map((detalle, index) => (
            <TableRow key={index}>
              <TableCell>
                <Select
                  value={detalle.id_producto?.toString() || ""}
                  onValueChange={(value) =>
                    handleChange(index, "id_producto", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {infoExtra?.productos.map((producto) => (
                      <SelectItem
                        key={producto.id}
                        value={producto.id.toString()}
                      >
                        {producto.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={detalle.cantidad}
                  onChange={(e) =>
                    handleChange(index, "cantidad", parseInt(e.target.value))
                  }
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleRemoveRow(index)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={handleAddRow}>Agregar Concepto</Button>
    </div>
  );
}
