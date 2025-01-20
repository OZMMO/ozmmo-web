'use client'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Define types for fetched data
interface Country {
    id: number;
    descripcion: string;
}

interface State {
    id: number;
    descripcion: string;
}

interface Municipality {
    id: number;
    descripcion: string;
}

interface Locality {
    id: number;
    descripcion: string;
}

interface Neighborhood {
    id: number;
    nombre_asentamiento: string;
}

export default function Direccion() {
    const [postalCode, setPostalCode] = useState('')
    const [countries, setCountries] = useState<Country[]>([])
    const [states, setStates] = useState<State[]>([])
    const [municipalities, setMunicipalities] = useState<Municipality[]>([])
    const [localities, setLocalities] = useState<Locality[]>([])
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
    const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null)
    const [street, setStreet] = useState('')
    const [exteriorNumber, setExteriorNumber] = useState('')
    const [interiorNumber, setInteriorNumber] = useState('')

    useEffect(() => {
        
    }, [])

    const handlePostalCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setPostalCode(e.target.value);
        
    };

    const handleNeighborhoodSelect = async (value: string) => {
        const neighborhood = neighborhoods.find(n => n.id === parseInt(value))
        if (!neighborhood) return
        
       
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Crear modificar dirección empleado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="postal-code">Código Postal</Label>
                    <Input
                        id="postal-code"
                        value={postalCode}
                        onChange={handlePostalCodeChange}
                        maxLength={5}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un país" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map(country => (
                                <SelectItem key={country.id} value={country.id.toString()}>
                                    {country.descripcion}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                        <SelectContent>
                            {states.map(state => (
                                <SelectItem key={state.id} value={state.id.toString()}>
                                    {state.descripcion}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="municipality">Municipio</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un municipio" />
                        </SelectTrigger>
                        <SelectContent>
                            {municipalities.map(municipality => (
                                <SelectItem key={municipality.id} value={municipality.id.toString()}>
                                    {municipality.descripcion}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="locality">Localidad</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una localidad" />
                        </SelectTrigger>
                        <SelectContent>
                            {localities.map(locality => (
                                <SelectItem key={locality.id} value={locality.id.toString()}>
                                    {locality.descripcion}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="neighborhood">Colonia</Label>
                    <pre>{JSON.stringify(neighborhoods, null, 2)}</pre>
                    <Select onValueChange={handleNeighborhoodSelect}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una colonia" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* {neighborhoods.map(neighborhood => (
                                <SelectItem key={neighborhood.id} value={neighborhood.id.toString()}>
                                    {neighborhood.nombre_asentamiento}
                                </SelectItem>
                            ))} */}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="street">Calle</Label>
                    <Input
                        id="street"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="exterior-number">Número exterior</Label>
                    <Input
                        id="exterior-number"
                        value={exteriorNumber}
                        onChange={(e) => setExteriorNumber(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="interior-number">Número interior</Label>
                    <Input
                        id="interior-number"
                        value={interiorNumber}
                        onChange={(e) => setInteriorNumber(e.target.value)}
                    />
                </div>
            </CardContent>
        </Card>
    )
}