-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS catalogos;

-- Otorgar permisos al usuario anónimo (auth.anon) para el schema catalogos
GRANT USAGE ON SCHEMA catalogos TO anon;
GRANT USAGE ON SCHEMA catalogos TO authenticated;
GRANT USAGE ON SCHEMA catalogos TO service_role;

-- Otorgar permisos para todas las tablas existentes en el schema
GRANT ALL ON ALL TABLES IN SCHEMA catalogos TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA catalogos TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA catalogos TO service_role;

-- Otorgar permisos para futuras tablas (importante para migraciones)
ALTER DEFAULT PRIVILEGES IN SCHEMA catalogos
GRANT ALL ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA catalogos
GRANT ALL ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA catalogos
GRANT ALL ON TABLES TO service_role;

-- Create enum types
CREATE TYPE catalogos.tipo_contribuyente AS ENUM ('Física', 'Moral');

-- Create empresa table
CREATE TABLE IF NOT EXISTS catalogos.tbl_empresas (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL,
    rfc VARCHAR(13) NOT NULL,
    razon_social VARCHAR(255) NOT NULL,
    nombre_comercial VARCHAR(255),
    curp VARCHAR(18),
    tipo_contribuyente catalogos.tipo_contribuyente NOT NULL,
    regimen_fiscal VARCHAR(3) NULL,
    correo_electronico VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    representante_legal VARCHAR(255),
    certificado_csd TEXT NULL,
    llave_privada_csd TEXT NULL,
    contrasena_csd VARCHAR(255) NULL,
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    estatus BOOLEAN DEFAULT true,
    
    -- Add constraints
    CONSTRAINT uk_catalogos_empresas_codigo UNIQUE (codigo),
    CONSTRAINT uk_catalogos_empresas_rfc UNIQUE (rfc),
    CONSTRAINT chk_catalogos_empresas_rfc_length CHECK (LENGTH(rfc) IN (12, 13)),
    CONSTRAINT chk_catalogos_empresas_curp_length CHECK (curp IS NULL OR LENGTH(curp) = 18),
    CONSTRAINT chk_catalogos_empresas_regimen_fiscal CHECK (LENGTH(regimen_fiscal) = 3),
    CONSTRAINT chk_catalogos_empresas_correo_electronico CHECK (correo_electronico ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Después de crear la tabla, agregar este permiso
GRANT USAGE, SELECT ON SEQUENCE catalogos.tbl_empresas_id_seq TO authenticated;

-- Create indexes
CREATE INDEX idx_empresas_rfc ON catalogos.tbl_empresas (rfc);
CREATE INDEX idx_empresas_razon_social ON catalogos.tbl_empresas (razon_social);
CREATE INDEX idx_empresas_estatus ON catalogos.tbl_empresas (estatus);

-- Enable Row Level Security
ALTER TABLE catalogos.tbl_empresas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "pol_empresas_select" ON catalogos.tbl_empresas
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "pol_empresas_insert" ON catalogos.tbl_empresas
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "pol_empresas_update" ON catalogos.tbl_empresas
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create function to handle empresa updates
CREATE OR REPLACE FUNCTION catalogos.fn_update_empresa_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_registro = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamp
CREATE TRIGGER trg_update_empresa_timestamp
    BEFORE UPDATE ON catalogos.tbl_empresas
    FOR EACH ROW
    EXECUTE FUNCTION catalogos.fn_update_empresa_timestamp();

-- Comments
COMMENT ON TABLE catalogos.tbl_empresas IS 'Tabla para almacenar información de empresas';
COMMENT ON COLUMN catalogos.tbl_empresas.id IS 'Identificador único de la empresa';
COMMENT ON COLUMN catalogos.tbl_empresas.codigo IS 'Código único de la empresa';
COMMENT ON COLUMN catalogos.tbl_empresas.rfc IS 'RFC de la empresa';
COMMENT ON COLUMN catalogos.tbl_empresas.razon_social IS 'Razón social registrada';
COMMENT ON COLUMN catalogos.tbl_empresas.nombre_comercial IS 'Nombre comercial de la empresa';
COMMENT ON COLUMN catalogos.tbl_empresas.curp IS 'CURP en caso de persona física';
COMMENT ON COLUMN catalogos.tbl_empresas.tipo_contribuyente IS 'Tipo de contribuyente (Física o Moral)';
COMMENT ON COLUMN catalogos.tbl_empresas.regimen_fiscal IS 'Clave de régimen fiscal del SAT';
COMMENT ON COLUMN catalogos.tbl_empresas.correo_electronico IS 'Correo de contacto';
COMMENT ON COLUMN catalogos.tbl_empresas.telefono IS 'Teléfono de la empresa';
COMMENT ON COLUMN catalogos.tbl_empresas.representante_legal IS 'Nombre del representante legal';
COMMENT ON COLUMN catalogos.tbl_empresas.certificado_csd IS 'Base64 del CSD';
COMMENT ON COLUMN catalogos.tbl_empresas.llave_privada_csd IS 'Base64 de la llave privada';
COMMENT ON COLUMN catalogos.tbl_empresas.contrasena_csd IS 'Contraseña del CSD';
COMMENT ON COLUMN catalogos.tbl_empresas.fecha_registro IS 'Fecha de creación o última modificación del registro';
COMMENT ON COLUMN catalogos.tbl_empresas.estatus IS 'Estatus de la empresa (true=Activo, false=Inactivo)';
