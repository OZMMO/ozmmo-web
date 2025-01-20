-- Crear tablas con prefijo tbl y nombres en snake_case
CREATE TABLE sat_tbl_paises (
    id SERIAL PRIMARY KEY,
    clave_pais VARCHAR(3) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NOT NULL,
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sat_tbl_estados (
    id SERIAL PRIMARY KEY,
    clave_estado VARCHAR(3) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    pais_id INTEGER REFERENCES sat_tbl_paises(id),
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(clave_estado, pais_id)
);

CREATE TABLE sat_tbl_municipios (
    id SERIAL PRIMARY KEY,
    clave_municipio VARCHAR(3) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    estado_id INTEGER REFERENCES sat_tbl_estados(id),
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(clave_municipio, estado_id)
);

CREATE TABLE sat_tbl_localidades (
    id SERIAL PRIMARY KEY,
    clave_localidad VARCHAR(10),
    estado_id INTEGER NOT NULL REFERENCES sat_tbl_estados(id),
    descripcion VARCHAR(100) NOT NULL,
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sat_tbl_codigos_postales (
    id SERIAL PRIMARY KEY,
    codigo_postal VARCHAR(5) NOT NULL,
    municipio_id INTEGER REFERENCES sat_tbl_municipios(id),
    estado_id INTEGER REFERENCES sat_tbl_estados(id),
    localidad_id INTEGER REFERENCES sat_tbl_localidades(id),
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sat_tbl_colonias (
    id SERIAL PRIMARY KEY,
    clave_colonia VARCHAR(4) NOT NULL,
    codigo_postal_id INTEGER REFERENCES sat_tbl_codigos_postales(id),
    nombre_asentamiento VARCHAR(255),
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(clave_colonia, codigo_postal_id)
);

-- Crear índices con prefijo idx
CREATE INDEX idx_estados_pais ON sat_tbl_estados(pais_id);
CREATE INDEX idx_municipios_estado ON sat_tbl_municipios(estado_id);
CREATE INDEX idx_codigos_postales_municipio ON sat_tbl_codigos_postales(municipio_id);
CREATE INDEX idx_codigos_postales_estado ON sat_tbl_codigos_postales(estado_id);
CREATE INDEX idx_localidades_estado ON sat_tbl_localidades(estado_id);
CREATE INDEX idx_colonias_cp ON sat_tbl_colonias(codigo_postal_id);
CREATE INDEX idx_cp_codigo ON sat_tbl_codigos_postales(codigo_postal);

-- Crear políticas con prefijo pol
ALTER TABLE sat_tbl_paises ENABLE ROW LEVEL SECURITY;
ALTER TABLE sat_tbl_estados ENABLE ROW LEVEL SECURITY;
ALTER TABLE sat_tbl_municipios ENABLE ROW LEVEL SECURITY;
ALTER TABLE sat_tbl_codigos_postales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sat_tbl_colonias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pol_paises_select" ON sat_tbl_paises 
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "pol_estados_select" ON sat_tbl_estados 
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "pol_municipios_select" ON sat_tbl_municipios 
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "pol_codigos_postales_select" ON sat_tbl_codigos_postales 
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "pol_colonias_select" ON sat_tbl_colonias 
    FOR SELECT TO authenticated USING (true);