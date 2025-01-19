-- Seed para tipos de movimiento
INSERT INTO almacen.tbl_cat_tipos_movimiento (nombre, categoria, descripcion, esta_activo, created_at, updated_at)
VALUES
    ('Recepción de Compra', 'Entrada', 'Ingreso de mercancía desde un proveedor', true, NOW(), NOW()),
    ('Devolución de Cliente', 'Entrada', 'Productos devueltos por un cliente tras una venta', true, NOW(), NOW()),
    ('Despacho de Pedido', 'Salida', 'Productos enviados a un cliente como parte de un pedido', true, NOW(), NOW()),
    ('Devolución a Proveedor', 'Salida', 'Devolución de productos al proveedor', true, NOW(), NOW()),
    ('Reubicación Interna', 'Interno', 'Movimiento de productos dentro del almacén', true, NOW(), NOW()),
    ('Ajuste por Conteo', 'Ajuste', 'Corrección de inventario tras una auditoría física', true, NOW(), NOW()),
    ('Merma', 'Ajuste', 'Reducción por deterioro o caducidad', true, NOW(), NOW()),
    ('Pérdida por Daño', 'Ajuste', 'Reducción por productos dañados o defectuosos', true, NOW(), NOW());

-- Seed para estados de lote
INSERT INTO almacen.tbl_cat_estados_lote (nombre, descripcion, esta_activo, created_at, updated_at)
VALUES
    ('Activo', 'Lote disponible para uso', true, NOW(), NOW()),
    ('Bloqueado', 'Lote en revisión o cuarentena', true, NOW(), NOW()),
    ('Consumido', 'Lote completamente utilizado', true, NOW(), NOW()),
    ('Vencido', 'Lote caducado', true, NOW(), NOW()),
    ('Dañado', 'Lote con productos deteriorados', true, NOW(), NOW());

-- Seed para estados de ubicación
INSERT INTO almacen.tbl_cat_estado_ubicacion (descripcion, disponible, esta_activo, created_at, updated_at)
VALUES
    ('Disponible', true, true, NOW(), NOW()),
    ('Ocupado', false, true, NOW(), NOW()),
    ('En Mantenimiento', false, true, NOW(), NOW()),
    ('Bloqueado', false, true, NOW(), NOW()),
    ('Reservado', false, true, NOW(), NOW());

-- Seed para unidades de medida
INSERT INTO almacen.tbl_unidades_medida (nombre, abreviatura, esta_activo, created_at, updated_at)
VALUES
    ('Unidad', 'UN', true, NOW(), NOW()),
    ('Kilogramo', 'KG', true, NOW(), NOW()),
    ('Gramo', 'G', true, NOW(), NOW()),
    ('Litro', 'L', true, NOW(), NOW()),
    ('Mililitro', 'ML', true, NOW(), NOW()),
    ('Metro', 'M', true, NOW(), NOW()),
    ('Centímetro', 'CM', true, NOW(), NOW()),
    ('Metro Cuadrado', 'M2', true, NOW(), NOW()),
    ('Metro Cúbico', 'M3', true, NOW(), NOW()),
    ('Caja', 'CJ', true, NOW(), NOW()),
    ('Paquete', 'PQ', true, NOW(), NOW()),
    ('Docena', 'DOC', true, NOW(), NOW()),
    ('Pieza', 'PZ', true, NOW(), NOW()); 