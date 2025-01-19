create schema if not exists sat;


-- Otorgar permisos al usuario anónimo (auth.anon) para el schema sat
GRANT USAGE ON SCHEMA sat TO anon;
GRANT USAGE ON SCHEMA sat TO authenticated;
GRANT USAGE ON SCHEMA sat TO service_role;

-- Otorgar permisos para todas las tablas existentes en el schema
GRANT ALL ON ALL TABLES IN SCHEMA sat TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA sat TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA sat TO service_role;

-- Otorgar permisos para futuras tablas (importante para migraciones)
ALTER DEFAULT PRIVILEGES IN SCHEMA sat
GRANT ALL ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA sat
GRANT ALL ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA sat
GRANT ALL ON TABLES TO service_role;
