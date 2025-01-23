'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from "lucide-react"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Direccion } from '@/lib/db/sat/direcciones/direccion'
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DireccionFormProps {
    selectedDireccion: Direccion | null,
    setSelectedDireccion: (direccion: Direccion) => void
}

export default function DireccionForm({ selectedDireccion, setSelectedDireccion }: DireccionFormProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState('')
    const [direcciones, setDirecciones] = useState<Direccion[]>([])
    const [loading, setLoading] = useState(false)

    const searchDirecciones = useCallback(async (search: string) => {
        if (search.length < 3) {
            setDirecciones([])
            return
        }
        
        setLoading(true)
        try {
            const response = await fetch(`/api/direcciones?direccion=${search}`)
            if (!response.ok) throw new Error('Error fetching direcciones')
            const data: Direccion[] = await response.json()
            setDirecciones(data)
        } catch (error) {
            console.error('Error searching direcciones:', error)
            setDirecciones([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
          if (value) {
            searchDirecciones(value)
          } else {
            setDirecciones([])
          }
        }, 300)
    
        return () => clearTimeout(debounceTimer)
      }, [value, searchDirecciones]
    )
    

    return (
        <Card>
            {/* <CardHeader>
                <CardTitle>Dirección</CardTitle>
            </CardHeader> */}
            <CardContent className="space-y-4">
                <div className="space-y-2">
                   <Label>Buscar Dirección</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between text-wrap"
                            >
                                {selectedDireccion ? selectedDireccion.direccion_completa : "Buscar dirección..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                            <Command shouldFilter={false}>
                                <CommandInput 
                                    placeholder="Buscar dirección..." 
                                    value={value}
                                    onValueChange={(newValue) => {
                                        setValue(newValue)
                                    }}
                                    // onKeyDown={(e) => {
                                    //     if (e.key === 'Enter') {
                                    //         setValue(e.currentTarget.value)
                                    //     }
                                    // }}
                                    className="h-9"
                                />
                                <CommandList>
                                    <CommandEmpty>{loading ? 'Buscando...' : 'No se encontraron direcciones.'}</CommandEmpty>
                                    <CommandGroup>
                                        {direcciones.map((direccion) => (
                                            <CommandItem
                                                key={`${direccion.random_id}`}
                                                value={direccion.direccion_completa || ''}
                                                onSelect={() => {
                                                    if (setSelectedDireccion) {
                                                        setSelectedDireccion(direccion)
                                                    }
                                                    setOpen(false)
                                                }}
                                            >
                                                {direccion.direccion_completa}
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        selectedDireccion?.colonia_id === direccion.colonia_id
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="codigo_postal_id">Código Postal</Label>
                        <Input
                            id="codigo_postal_id"
                            value={selectedDireccion?.codigo_postal || ''}
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pais_id">País</Label>
                        <Input
                            id="pais_id"
                            value={selectedDireccion?.pais || ''}
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="estado_id">Estado</Label>
                        <Input
                            id="estado_id"
                            value={selectedDireccion?.estado || ''}
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="municipio_id">Municipio</Label>
                        <Input
                            id="municipio_id"
                            value={selectedDireccion?.municipio || ''}
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="localidad_id">Localidad</Label>
                        <Input
                            id="localidad_id"
                            value={selectedDireccion?.localidad || ''}
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="colonia_id">Colonia</Label>
                        <Input
                            id="colonia_id"
                            value={selectedDireccion?.colonia || ''}
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="calle">Calle</Label>
                        <Input id="calle" value={selectedDireccion?.calle || ''} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="numero_exterior">Número exterior</Label>
                        <Input id="numero_exterior" value={selectedDireccion?.numero_exterior || ''} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="numero_interior">Número interior</Label>
                        <Input id="numero_interior" value={selectedDireccion?.numero_interior || ''} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}