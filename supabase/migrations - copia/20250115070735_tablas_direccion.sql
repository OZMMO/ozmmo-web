-- Crear tablas con prefijo tbl y nombres en snake_case
CREATE TABLE sat.tbl_paises (
    id SERIAL PRIMARY KEY,
    clave_pais VARCHAR(3) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NOT NULL,
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sat.tbl_estados (
    id SERIAL PRIMARY KEY,
    clave_estado VARCHAR(3) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    pais_id INTEGER REFERENCES sat.tbl_paises(id),
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(clave_estado, pais_id)
);

CREATE TABLE sat.tbl_municipios (
    id SERIAL PRIMARY KEY,
    clave_municipio VARCHAR(3) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    estado_id INTEGER REFERENCES sat.tbl_estados(id),
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(clave_municipio, estado_id)
);

CREATE TABLE sat.tbl_codigos_postales (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(5) NOT NULL,
    municipio_id INTEGER REFERENCES sat.tbl_municipios(id),
    estado_id INTEGER REFERENCES sat.tbl_estados(id),
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(codigo, municipio_id)
);

CREATE TABLE sat.tbl_colonias (
    id SERIAL PRIMARY KEY,
    clave_colonia VARCHAR(4) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    codigo_postal_id INTEGER REFERENCES sat.tbl_codigos_postales(id),
    tipo_asentamiento VARCHAR(50),
    tipo_zona VARCHAR(20),
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(clave_colonia, codigo_postal_id)
);

-- Crear índices con prefijo idx
CREATE INDEX idx_estados_pais ON sat.tbl_estados(pais_id);
CREATE INDEX idx_municipios_estado ON sat.tbl_municipios(estado_id);
CREATE INDEX idx_codigos_postales_municipio ON sat.tbl_codigos_postales(municipio_id);
CREATE INDEX idx_codigos_postales_estado ON sat.tbl_codigos_postales(estado_id);
CREATE INDEX idx_colonias_cp ON sat.tbl_colonias(codigo_postal_id);
CREATE INDEX idx_cp_codigo ON sat.tbl_codigos_postales(codigo);

-- Crear vista con prefijo vw
CREATE VIEW sat.vw_ubicaciones AS
SELECT 
    c.id AS colonia_id,
    c.descripcion AS colonia,
    c.tipo_asentamiento,
    c.tipo_zona,
    cp.codigo AS codigo_postal,
    m.descripcion AS municipio,
    e.descripcion AS estado,
    p.descripcion AS pais
FROM sat.tbl_colonias c
JOIN sat.tbl_codigos_postales cp ON c.codigo_postal_id = cp.id
JOIN sat.tbl_municipios m ON cp.municipio_id = m.id
JOIN sat.tbl_estados e ON cp.estado_id = e.id
JOIN sat.tbl_paises p ON e.pais_id = p.id
WHERE c.esta_activo = true
    AND cp.esta_activo = true
    AND m.esta_activo = true
    AND e.esta_activo = true
    AND p.esta_activo = true;

-- Crear función con prefijo fn
CREATE OR REPLACE FUNCTION sat.fn_buscar_por_cp(p_codigo_postal VARCHAR)
RETURNS TABLE (
    colonia VARCHAR,
    tipo_asentamiento VARCHAR,
    municipio VARCHAR,
    estado VARCHAR,
    codigo_postal VARCHAR
) LANGUAGE sql AS $$
    SELECT 
        c.descripcion AS colonia,
        c.tipo_asentamiento,
        m.descripcion AS municipio,
        e.descripcion AS estado,
        cp.codigo AS codigo_postal
    FROM sat.tbl_colonias c
    JOIN sat.tbl_codigos_postales cp ON c.codigo_postal_id = cp.id
    JOIN sat.tbl_municipios m ON cp.municipio_id = m.id
    JOIN sat.tbl_estados e ON cp.estado_id = e.id
    WHERE cp.codigo = p_codigo_postal
        AND c.esta_activo = true
        AND cp.esta_activo = true;
$$;

-- Crear políticas con prefijo pol
ALTER TABLE sat.tbl_paises ENABLE ROW LEVEL SECURITY;
ALTER TABLE sat.tbl_estados ENABLE ROW LEVEL SECURITY;
ALTER TABLE sat.tbl_municipios ENABLE ROW LEVEL SECURITY;
ALTER TABLE sat.tbl_codigos_postales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sat.tbl_colonias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pol_paises_select" ON sat.tbl_paises 
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "pol_estados_select" ON sat.tbl_estados 
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "pol_municipios_select" ON sat.tbl_municipios 
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "pol_codigos_postales_select" ON sat.tbl_codigos_postales 
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "pol_colonias_select" ON sat.tbl_colonias 
    FOR SELECT TO authenticated USING (true);