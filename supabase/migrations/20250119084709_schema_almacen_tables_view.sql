-- Tabla de bodegas
CREATE TABLE almacen_tbl_bodega (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    empresa_id INTEGER REFERENCES catalogos_tbl_empresas(id),
   -- sucursal_id INTEGER,
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT uk_almacen_bodega_codigo UNIQUE (codigo)
);

-- Después de crear la tabla, agregar este permiso
GRANT USAGE, SELECT ON SEQUENCE almacen_tbl_bodega_id_seq TO authenticated;

-- Create indexes
CREATE INDEX idx_bodega_codigo ON almacen_tbl_bodega (codigo);
CREATE INDEX idx_bodega_descripcion ON almacen_tbl_bodega (descripcion);
CREATE INDEX idx_bodega_empresa ON almacen_tbl_bodega (empresa_id);
CREATE INDEX idx_bodega_esta_activo ON almacen_tbl_bodega (esta_activo);
-- Enable Row Level Security
ALTER TABLE almacen_tbl_bodega ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "pol_bodega_select" ON almacen_tbl_bodega
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "pol_bodega_insert" ON almacen_tbl_bodega
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "pol_bodega_update" ON almacen_tbl_bodega
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create function to handle empresa updates
CREATE OR REPLACE FUNCTION almacen_fn_update_bodega_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_registro = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamp
CREATE TRIGGER trg_update_bodega_timestamp
    BEFORE UPDATE ON almacen_tbl_bodega
    FOR EACH ROW
    EXECUTE FUNCTION almacen_fn_update_bodega_timestamp();


-- Tabla de unidades de medida
CREATE TABLE almacen_tbl_unidades_medida (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    abreviatura VARCHAR(10) NOT NULL,
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla catálogo de estados de ubicación
CREATE TABLE almacen_tbl_cat_estado_ubicacion (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    disponible BOOLEAN DEFAULT true,
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de ubicaciones
CREATE TABLE almacen_tbl_ubicaciones (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(100),
    capacidad_maxima DECIMAL(18, 2),
    estado_ubicacion_id INTEGER REFERENCES almacen_tbl_cat_estado_ubicacion(id),
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE almacen_tbl_productos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    codigo_proveedor VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(255),
    unidad_medida_id INTEGER REFERENCES almacen_tbl_unidades_medida(id),
    peso DECIMAL(18, 2),
    volumen DECIMAL(18, 2),
    es_ensamble BOOLEAN DEFAULT false,
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de lista de materiales
CREATE TABLE almacen_tbl_lista_materiales (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES almacen_tbl_productos(id),
    cantidad_necesaria DECIMAL(18, 2),
    unidad_medida_id INTEGER REFERENCES almacen_tbl_unidades_medida(id),
    nota VARCHAR(255),
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de proveedores
CREATE TABLE almacen_tbl_proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion VARCHAR(255),
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de recepciones
CREATE TABLE almacen_tbl_recepciones (
    id SERIAL PRIMARY KEY,
    fecha_recepcion TIMESTAMPTZ DEFAULT NOW(),
    proveedor_id INTEGER REFERENCES almacen_tbl_proveedores(id),
    completado BOOLEAN DEFAULT false,
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de detalle de recepciones
CREATE TABLE almacen_tbl_detalle_recepciones (
    id SERIAL PRIMARY KEY,
    recepcion_id INTEGER REFERENCES almacen_tbl_recepciones(id),
    producto_id INTEGER REFERENCES almacen_tbl_productos(id),
    cantidad DECIMAL(18, 2),
    ubicacion_id INTEGER REFERENCES almacen_tbl_ubicaciones(id),
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla catálogo de tipos de movimiento
CREATE TABLE almacen_tbl_cat_tipos_movimiento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    categoria VARCHAR(20), -- Entrada, Salida, Interno, Ajuste
    descripcion VARCHAR(255),
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla catálogo de estados de lote
CREATE TABLE almacen_tbl_cat_estados_lote (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255), -- Activo, Consumido, Bloqueado, etc.
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de lotes
CREATE TABLE almacen_tbl_lotes (
    id SERIAL PRIMARY KEY,
    codigo_lote VARCHAR(50) UNIQUE NOT NULL,
    producto_id INTEGER REFERENCES almacen_tbl_productos(id),
    fecha_fabricacion DATE,
    fecha_expiracion DATE,
    cantidad_inicial DECIMAL(18, 2),
    cantidad_disponible DECIMAL(18, 2),
    estado_lote_id INTEGER REFERENCES almacen_tbl_cat_estados_lote(id),
    recepcion_id INTEGER REFERENCES almacen_tbl_recepciones(id),
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de lotes por ubicación
CREATE TABLE almacen_tbl_lotes_ubicaciones (
    id SERIAL PRIMARY KEY,
    lote_id INTEGER REFERENCES almacen_tbl_lotes(id),
    ubicacion_id INTEGER REFERENCES almacen_tbl_ubicaciones(id),
    cantidad DECIMAL(18, 2),
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de trazabilidad de lotes
CREATE TABLE almacen_tbl_trazabilidad_lotes (
    id SERIAL PRIMARY KEY,
    lote_id INTEGER REFERENCES almacen_tbl_lotes(id),
    producto_id INTEGER REFERENCES almacen_tbl_productos(id),
    ubicacion_origen_id INTEGER REFERENCES almacen_tbl_ubicaciones(id),
    ubicacion_destino_id INTEGER REFERENCES almacen_tbl_ubicaciones(id),
    cantidad DECIMAL(18, 2),
    tipo_movimiento_id INTEGER REFERENCES almacen_tbl_cat_tipos_movimiento(id),
    referencia_movimiento VARCHAR(100),
    notas VARCHAR(255),
    esta_activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear índices
CREATE INDEX idx_productos_unidad_medida ON almacen_tbl_productos(unidad_medida_id);
CREATE INDEX idx_ubicaciones_estado ON almacen_tbl_ubicaciones(estado_ubicacion_id);
CREATE INDEX idx_lista_materiales_producto ON almacen_tbl_lista_materiales(producto_id);
CREATE INDEX idx_lista_materiales_unidad ON almacen_tbl_lista_materiales(unidad_medida_id);
CREATE INDEX idx_recepciones_proveedor ON almacen_tbl_recepciones(proveedor_id);
CREATE INDEX idx_detalle_recepciones_recepcion ON almacen_tbl_detalle_recepciones(recepcion_id);
CREATE INDEX idx_detalle_recepciones_producto ON almacen_tbl_detalle_recepciones(producto_id);
CREATE INDEX idx_detalle_recepciones_ubicacion ON almacen_tbl_detalle_recepciones(ubicacion_id);

-- Crear índices adicionales
CREATE INDEX idx_lotes_producto ON almacen_tbl_lotes(producto_id);
CREATE INDEX idx_lotes_estado ON almacen_tbl_lotes(estado_lote_id);
CREATE INDEX idx_lotes_recepcion ON almacen_tbl_lotes(recepcion_id);
CREATE INDEX idx_lotes_ubicaciones_lote ON almacen_tbl_lotes_ubicaciones(lote_id);
CREATE INDEX idx_lotes_ubicaciones_ubicacion ON almacen_tbl_lotes_ubicaciones(ubicacion_id);
CREATE INDEX idx_trazabilidad_lote ON almacen_tbl_trazabilidad_lotes(lote_id);
CREATE INDEX idx_trazabilidad_producto ON almacen_tbl_trazabilidad_lotes(producto_id);
CREATE INDEX idx_trazabilidad_tipo_mov ON almacen_tbl_trazabilidad_lotes(tipo_movimiento_id);
CREATE INDEX idx_trazabilidad_ubicacion_origen ON almacen_tbl_trazabilidad_lotes(ubicacion_origen_id);
CREATE INDEX idx_trazabilidad_ubicacion_destino ON almacen_tbl_trazabilidad_lotes(ubicacion_destino_id);

-- Habilitar RLS
ALTER TABLE almacen_tbl_bodega ENABLE ROW LEVEL SECURITY;
ALTER TABLE almacen_tbl_unidades_medida ENABLE ROW LEVEL SECURITY;
ALTER TABLE almacen_tbl_cat_estado_ubicacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE almacen_tbl_ubicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE almacen_tbl_productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE almacen_tbl_lista_materiales ENABLE ROW LEVEL SECURITY;
ALTER TABLE almacen_tbl_proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE almacen_tbl_recepciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE almacen_tbl_detalle_recepciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE almacen_tbl_cat_tipos_movimiento ENABLE ROW LEVEL SECURITY;
ALTER TABLE almacen_tbl_cat_estados_lote ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS para las nuevas tablas
ALTER TABLE almacen_tbl_lotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE almacen_tbl_lotes_ubicaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE almacen_tbl_trazabilidad_lotes ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad

CREATE POLICY "pol_unidades_medida_select" ON almacen_tbl_unidades_medida 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "pol_cat_estado_ubicacion_select" ON almacen_tbl_cat_estado_ubicacion 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "pol_ubicaciones_select" ON almacen_tbl_ubicaciones 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "pol_productos_select" ON almacen_tbl_productos 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "pol_lista_materiales_select" ON almacen_tbl_lista_materiales 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "pol_proveedores_select" ON almacen_tbl_proveedores 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "pol_recepciones_select" ON almacen_tbl_recepciones 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "pol_detalle_recepciones_select" ON almacen_tbl_detalle_recepciones 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "pol_cat_tipos_movimiento_select" ON almacen_tbl_cat_tipos_movimiento 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "pol_cat_estados_lote_select" ON almacen_tbl_cat_estados_lote 
    FOR SELECT TO authenticated USING (true);

-- Crear políticas de seguridad para las nuevas tablas
CREATE POLICY "pol_lotes_select" ON almacen_tbl_lotes 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "pol_lotes_ubicaciones_select" ON almacen_tbl_lotes_ubicaciones 
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "pol_trazabilidad_lotes_select" ON almacen_tbl_trazabilidad_lotes 
    FOR SELECT TO authenticated USING (true);




-- Crear vista para bodegas con información de empresa y sucursal
CREATE OR REPLACE VIEW almacen_vw_bodegas AS
SELECT 
    b.id,
    b.codigo,
    b.descripcion,
    b.empresa_id,
    COALESCE(e.nombre_comercial , 'Sin empresa') as empresa_nombre,
    --b.sucursal_id,
    --isnull(s.nombre, '') as sucursal_nombre,
    b.esta_activo,
    b.created_at,
    b.updated_at
FROM 
    almacen_tbl_bodega b
    LEFT JOIN catalogos_tbl_empresas e ON b.empresa_id = e.id;
    --LEFT JOIN catalogos.tbl_sucursales s ON b.sucursal_id = s.id

-- Permisos de la vista
GRANT SELECT ON almacen_vw_bodegas TO authenticated; 
