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
                                {selectedDireccion ? selectedDireccion.Direccion : "Buscar dirección..."}
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
                                                key={`${direccion.RandomUUID}`}
                                                value={direccion.Direccion}
                                                onSelect={() => {
                                                    if (setSelectedDireccion) {
                                                        setSelectedDireccion(direccion)
                                                    }
                                                    setOpen(false)
                                                }}
                                            >
                                                {direccion.Direccion}
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        selectedDireccion?.IDColonia === direccion.IDColonia
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
                        <Label htmlFor="postal-code">Código Postal</Label>
                        <Input
                            id="postal-code"
                            value={selectedDireccion?.CodigoPostal || ''}
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="country">País</Label>
                        <Input
                            id="country"
                            value={selectedDireccion?.Pais || ''}
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="state">Estado</Label>
                        <Input
                            id="state"
                            value={selectedDireccion?.Estado || ''}
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="municipality">Municipio</Label>
                        <Input
                            id="municipality"
                            value={selectedDireccion?.Municipio || ''}
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="locality">Localidad</Label>
                        <Input
                            id="locality"
                            value={selectedDireccion?.Localidad || ''}
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="neighborhood">Colonia</Label>
                        <Input
                            id="neighborhood"
                            value={selectedDireccion?.Colonia || ''}
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="street">Calle</Label>
                        <Input id="street" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="exterior-number">Número exterior</Label>
                        <Input id="exterior-number" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="interior-number">Número interior</Label>
                        <Input id="interior-number" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}