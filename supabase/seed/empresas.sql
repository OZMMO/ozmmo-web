
-- Insertar datos de prueba en la tabla empresas
INSERT INTO catalogos_tbl_empresas (
  codigo,
  rfc,
  razon_social,
  nombre_comercial,
  tipo_contribuyente,
  regimen_fiscal,
  correo_electronico,
  telefono,
  curp
) VALUES (
  'EMP001',
  'XAXX010101000',
  'Empresa de Prueba SA de CV',
  'Empresa de Prueba',
  'Moral',
  '601',
  'contacto@empresa.com',
  '5555555555',
  NULL
),
(
  'EMP002', 
  'AABL861025ABC',
  'Abreu Batista Luis',
  'Consultoria Abreu',
  'Física',
  '612',
  'luis@abreu.com',
  '5512345678',
  'AABL861025HDFBTS09'
),
(
  'EMP003',
  'MELM8502169H5',
  'Mendoza Lopez Maria',
  'Servicios Contables MLM',
  'Física',
  '621',
  'maria@mendoza.com',
  '5523456789',
  'MELM850216MDFNPR03'
),
(
  'EMP004',
  'TECH789456ABC',
  'Tecnología Avanzada SA de CV',
  'TechPro',
  'Moral',
  '601',
  'info@techpro.com',
  '5534567890',
  NULL
),
(
  'EMP005',
  'GORS780405RF2',
  'González Ruiz Sofia',
  'Diseños González',
  'Física',
  '612',
  'sofia@gonzalez.com',
  '5545678901',
  'GORS780405MDFNZF08'
);
