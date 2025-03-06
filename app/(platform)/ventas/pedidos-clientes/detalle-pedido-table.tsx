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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Concepto</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localDetalles.map((detalle, index) => (
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
