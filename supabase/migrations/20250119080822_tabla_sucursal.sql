CREATE TABLE catalogos_tbl_sucursales (
  id SERIAL PRIMARY KEY,
  empresa_id SERIAL NOT NULL REFERENCES catalogos_tbl_empresas(id),
  codigo VARCHAR(50),
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  correo_electronico VARCHAR(255) NOT NULL,
  responsable VARCHAR(255),
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  estatus BOOLEAN DEFAULT true
);

GRANT USAGE, SELECT ON SEQUENCE catalogos_tbl_sucursales_id_seq TO authenticated;

-- Add comment on table
COMMENT ON TABLE catalogos_tbl_sucursales IS 'Tabla para almacenar información de sucursales';

-- Add comments on columns
COMMENT ON COLUMN catalogos_tbl_sucursales.empresa_id IS 'ID de la empresa a la que pertenece la sucursal';
COMMENT ON COLUMN catalogos_tbl_sucursales.nombre IS 'Nombre de la sucursal';
COMMENT ON COLUMN catalogos_tbl_sucursales.codigo IS 'Código interno de la sucursal';
COMMENT ON COLUMN catalogos_tbl_sucursales.telefono IS 'Teléfono de contacto de la sucursal';
COMMENT ON COLUMN catalogos_tbl_sucursales.correo_electronico IS 'Correo electrónico de contacto de la sucursal';
COMMENT ON COLUMN catalogos_tbl_sucursales.responsable IS 'Nombre del responsable de la sucursal';
COMMENT ON COLUMN catalogos_tbl_sucursales.fecha_registro IS 'Fecha de creación del registro';
COMMENT ON COLUMN catalogos_tbl_sucursales.estatus IS 'Estado activo/inactivo de la sucursal';