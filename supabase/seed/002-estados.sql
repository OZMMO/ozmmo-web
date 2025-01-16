-- Seed para la tabla de estados (solo México)
DO $$
DECLARE
    mexico_id int4;
BEGIN
    SELECT id INTO mexico_id FROM sat.tbl_paises WHERE clave_pais = 'MEX';

    INSERT INTO sat.tbl_estados (clave_estado, descripcion, pais_id, esta_activo, created_at, updated_at)
    VALUES 
        ('AGU', 'AGUASCALIENTES', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('BCN', 'BAJA CALIFORNIA', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('BCS', 'BAJA CALIFORNIA SUR', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('CAM', 'CAMPECHE', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('CHP', 'CHIAPAS', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('CHH', 'CHIHUAHUA', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('COA', 'COAHUILA', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('COL', 'COLIMA', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('CMX', 'CIUDAD DE MÉXICO', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('DUR', 'DURANGO', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('GUA', 'GUANAJUATO', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('GRO', 'GUERRERO', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('HID', 'HIDALGO', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('JAL', 'JALISCO', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('MEX', 'ESTADO DE MÉXICO', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('MIC', 'MICHOACÁN', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('MOR', 'MORELOS', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('NAY', 'NAYARIT', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('NLE', 'NUEVO LEÓN', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('OAX', 'OAXACA', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('PUE', 'PUEBLA', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('QUE', 'QUERÉTARO', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('ROO', 'QUINTANA ROO', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('SLP', 'SAN LUIS POTOSÍ', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('SIN', 'SINALOA', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('SON', 'SONORA', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('TAB', 'TABASCO', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('TAM', 'TAMAULIPAS', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('TLA', 'TLAXCALA', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('VER', 'VERACRUZ', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('YUC', 'YUCATÁN', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('ZAC', 'ZACATECAS', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        ('EX', 'EXTRANJERO', mexico_id, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (clave_estado, pais_id) DO NOTHING;
END $$;
