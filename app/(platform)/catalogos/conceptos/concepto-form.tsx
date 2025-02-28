"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { conceptoFormSchema } from "./schemas";
// import DireccionForm from "@/components/direccion"
import { useEffect, useState } from "react";
import {
  Concepto,
  UsoCFDI,
  Impuesto,
  ObjetoImp,
  TipoFactor,
  ClaveProdServ,
  ClaveUnidad,
} from "@/lib/db";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

export type ConceptoFormValues = z.infer<typeof conceptoFormSchema>;

export interface InfoExtraConcepto {
  dataUsoCFDI: UsoCFDI[];
  dataImpuesto: Impuesto[];
  dataObjetoImp: ObjetoImp[];
  dataTipoFactor: TipoFactor[];
  dataClaveProdServ: ClaveProdServ[];
  dataClaveUnidad: ClaveUnidad[];
  // tiposContribuyentes: TipoContribuyente[]
  // regimenesFiscales: RegimenFiscal[]
}

interface ConceptoFormProps {
  initialData?: Concepto | null;
  onSubmit: (data: Concepto) => void;
  infoExtra?: InfoExtraConcepto;
}

export function ConceptoForm({
  initialData,
  onSubmit,
  infoExtra,
}: ConceptoFormProps) {
  const form = useForm<ConceptoFormValues>({
    resolver: zodResolver(conceptoFormSchema),
    defaultValues: {
      codigo: initialData?.codigo || "",
      descripcion: initialData?.descripcion || "",
      uso_cfdi: initialData?.uso_cfdi || "",
      clave_prod_serv: initialData?.clave_prod_serv || "",
      ClaveUnidad: initialData?.ClaveUnidad || "",
      ValorUnitario: initialData?.ValorUnitario || 0,
      ObjetoImp: initialData?.ObjetoImp || "",
      Impuesto: initialData?.Impuesto || "",
      TipoFactor: initialData?.TipoFactor || "",
    },
  });

  const handleSubmit = (data: ConceptoFormValues) => {
    data.id = initialData?.id || 0;

    onSubmit(data as Concepto);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 py-4"
      >
        <input type="hidden" name="id" value={initialData?.id} />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: EMP001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Concepto de prueba" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="uso_cfdi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Uso CFDI</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value.toString())}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.dataUsoCFDI.map((tipo) => (
                      <SelectItem key={tipo.uso_cfdi} value={tipo.uso_cfdi}>
                        {tipo.uso_cfdi} - {tipo.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clave_prod_serv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clave Producto Servicio</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value.toString())}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione clave" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.dataClaveProdServ.map((tipo) => (
                      <SelectItem
                        key={tipo.clave_prod_serv}
                        value={tipo.clave_prod_serv}
                      >
                        {tipo.clave_prod_serv} - {tipo.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ClaveUnidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clave Unidad</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value.toString())}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione clave Unidad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.dataClaveUnidad.map((tipo) => (
                      <SelectItem
                        key={tipo.clave_unidad}
                        value={tipo.clave_unidad}
                      >
                        {tipo.clave_unidad} - {tipo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ObjetoImp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objeto Impuesto</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value.toString())}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione objeto impuesto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.dataObjetoImp.map((tipo) => (
                      <SelectItem key={tipo.objeto_imp} value={tipo.objeto_imp}>
                        {tipo.objeto_imp} - {tipo.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Impuesto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Impuesto</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value.toString())}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione impuesto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.dataImpuesto.map((tipo) => (
                      <SelectItem key={tipo.impuesto} value={tipo.impuesto}>
                        {tipo.impuesto} - {tipo.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="TipoFactor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo Factor</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value.toString())}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo factor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.dataTipoFactor.map((tipo) => (
                      <SelectItem
                        key={tipo.tipo_factor}
                        value={tipo.tipo_factor}
                      >
                        {tipo.tipo_factor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ValorUnitario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Unitario</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ej: 1000"
                    {...field}
                    value={field.value?.toString() ?? ""}
                    onChange={(event) =>
                      field.onChange(+event.target.value || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  );
}
