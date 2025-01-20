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

CREATE TABLE sat_tbl_direcciones (
    id SERIAL PRIMARY KEY,
    pais_id INTEGER REFERENCES sat_tbl_paises(id),
    estado_id INTEGER REFERENCES sat_tbl_estados(id),
    municipio_id INTEGER REFERENCES sat_tbl_municipios(id),
    localidad_id INTEGER REFERENCES sat_tbl_localidades(id),
    codigo_postal_id INTEGER REFERENCES sat_tbl_codigos_postales(id),
    colonia_id INTEGER REFERENCES sat_tbl_colonias(id),
    direccion VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Crear índices con prefijo idx
CREATE INDEX idx_estados_pais ON sat_tbl_estados(pais_id);
CREATE INDEX idx_municipios_estado ON sat_tbl_municipios(estado_id);
CREATE INDEX idx_codigos_postales_municipio ON sat_tbl_codigos_postales(municipio_id);
CREATE INDEX idx_codigos_postales_estado ON sat_tbl_codigos_postales(estado_id);
CREATE INDEX idx_localidades_estado ON sat_tbl_localidades(estado_id);
CREATE INDEX idx_colonias_cp ON sat_tbl_colonias(codigo_postal_id);
CREATE INDEX idx_cp_codigo ON sat_tbl_codigos_postales(codigo_postal);
CREATE INDEX idx_direcciones_pais ON sat_tbl_direcciones(pais_id);
CREATE INDEX idx_direcciones_estado ON sat_tbl_direcciones(estado_id);
CREATE INDEX idx_direcciones_municipio ON sat_tbl_direcciones(municipio_id);
CREATE INDEX idx_direcciones_localidad ON sat_tbl_direcciones(localidad_id);
CREATE INDEX idx_direcciones_codigo_postal ON sat_tbl_direcciones(codigo_postal_id);
CREATE INDEX idx_direcciones_colonia ON sat_tbl_direcciones(colonia_id);


-- Crear políticas con prefijo pol
ALTER TABLE sat_tbl_paises ENABLE ROW LEVEL SECURITY;
ALTER TABLE sat_tbl_estados ENABLE ROW LEVEL SECURITY;
ALTER TABLE sat_tbl_municipios ENABLE ROW LEVEL SECURITY;
ALTER TABLE sat_tbl_codigos_postales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sat_tbl_colonias ENABLE ROW LEVEL SECURITY;
ALTER TABLE sat_tbl_direcciones ENABLE ROW LEVEL SECURITY;

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
CREATE POLICY "pol_localidades_select" ON sat_tbl_localidades 
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "pol_direcciones_select" ON sat_tbl_direcciones 
    FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION fn_buscar_direccion(p_direccion TEXT)
RETURNS TABLE (
    direccion TEXT,
    idpais INTEGER,
    pais TEXT,
    idestado INTEGER, 
    estado TEXT,
    idmunicipio INTEGER,
    municipio TEXT,
    idcolonia INTEGER,
    colonia TEXT,
    idcodigopostal INTEGER,
    codigo_postal TEXT,
    idlocalidad INTEGER,
    localidad TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        UPPER(COALESCE(p.descripcion, '') || ', ' || COALESCE(e.descripcion, '') || ', ' || COALESCE(m.descripcion, '') || ', ' || COALESCE(l.descripcion, '') || ', ' || COALESCE(c.nombre_asentamiento, '') || ', CP:' || COALESCE(cp.codigo_postal, '')) AS direccion,
        COALESCE(p.id, 0) AS idpais,
        UPPER(p.descripcion) AS pais,
        COALESCE(e.id, 0) AS idestado,
        UPPER(e.descripcion) AS estado,
        COALESCE(m.id, 0) AS idmunicipio,
        UPPER(m.descripcion) AS municipio,
        COALESCE(c.id, 0) AS idcolonia,
        UPPER(c.nombre_asentamiento) AS colonia,
        COALESCE(cp.id, 0) AS idcodigopostal,
        cp.codigo_postal,
        COALESCE(l.id, 0) AS idlocalidad,
        UPPER(l.descripcion) AS localidad
    FROM sat_tbl_codigos_postales cp
    LEFT JOIN sat_tbl_colonias c ON c.codigo_postal_id = cp.id
    INNER JOIN sat_tbl_estados e ON e.id = cp.estado_id
    LEFT JOIN sat_tbl_municipios m ON COALESCE(cp.municipio_id, 0) = COALESCE(m.id, 0) AND COALESCE(m.estado_id, 0) = COALESCE(e.id, 0)
    INNER JOIN sat_tbl_paises p ON COALESCE(p.id, 0) = COALESCE(e.pais_id, 0)
    LEFT JOIN sat_tbl_localidades l ON COALESCE(cp.estado_id, 0) = COALESCE(l.estado_id, 0) AND COALESCE(l.id, 0) = COALESCE(cp.localidad_id, 0)
    WHERE p_direccion = '' OR 
          cp.codigo_postal ILIKE '%' || p_direccion || '%' OR 
          c.nombre_asentamiento ILIKE '%' || p_direccion || '%' OR 
          e.descripcion ILIKE '%' || p_direccion || '%' OR 
          m.descripcion ILIKE '%' || p_direccion || '%' OR 
          p.descripcion ILIKE '%' || p_direccion || '%'
    ORDER BY e.descripcion ASC, m.descripcion ASC, c.nombre_asentamiento ASC;
END;
$$ LANGUAGE plpgsql;

