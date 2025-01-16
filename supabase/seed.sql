 -- Seed para la tabla de países (solo México)
INSERT INTO sat.tbl_paises (clave_pais, descripcion, esta_activo, created_at, updated_at)
VALUES (
    'MEX',                -- clave ISO 3166-1 alpha-3
    'México',             -- nombre oficial
    true,                 -- está activo
    CURRENT_TIMESTAMP,    -- created_at
    CURRENT_TIMESTAMP     -- updated_at
)
ON CONFLICT (clave_pais) DO NOTHING;