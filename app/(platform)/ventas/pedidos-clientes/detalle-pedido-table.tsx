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
import { DetallePedido, Concepto } from "@/lib/db";
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
import { PlusCircle } from "lucide-react";
interface DetallePedidoTableProps {
  detalles: DetallePedido[];
  onDetallesChange: (detalles: DetallePedido[]) => void;
  infoExtra?: {
    conceptos: Concepto[];
  };
}

export function DetallePedidoTable({
  detalles,
  onDetallesChange,
  infoExtra,
}: DetallePedidoTableProps) {
  const [localDetalles, setLocalDetalles] = useState<DetallePedido[]>(detalles);

  const handleAddRow = () => {
    const newDetalle: DetallePedido = {
      id_concepto: 0,
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
    field: keyof DetallePedido,
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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Detalles del Pedido</h3>
        <Button onClick={handleAddRow} variant="outline" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Agregar Concepto
        </Button>
        
      {/* <Button onClick={handleAddRow}>Agregar Concepto</Button> */}
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">Concepto</TableHead>
              <TableHead className="w-[20%]">Cantidad</TableHead>
              <TableHead className="w-[20%] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
          {localDetalles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                No hay conceptos agregados. Haga clic en "Agregar Concepto" para comenzar.
              </TableCell>
            </TableRow>
          ) : (
            localDetalles.map((detalle, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Select
                    value={detalle.id_concepto?.toString() || ""}
                    onValueChange={(value) =>
                      handleChange(index, "id_concepto", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un concepto" />
                    </SelectTrigger>
                    <SelectContent>
                      {infoExtra?.conceptos.map((concepto) => (
                        <SelectItem
                          key={concepto.id}
                          value={concepto.id.toString()}
                        >
                          {concepto.descripcion}
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
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRow(index)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
