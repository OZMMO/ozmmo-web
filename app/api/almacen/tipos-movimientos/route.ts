import type { NextApiRequest, NextApiResponse } from 'next'
import { TipoMovimientoModel } from "@/lib/db/almacen/tipos-movimientos/tipo-movimiento.model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const SoloActivos = req.query.SoloActivos === 'true';
  const Categorias = (req.query.Categorias || undefined) as string | undefined;
  const tiposMovimientos = await new TipoMovimientoModel().findMany({ SoloActivos, Categorias });

  return res.status(200).json(tiposMovimientos);
}