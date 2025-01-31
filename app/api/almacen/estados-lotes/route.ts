import type { NextApiRequest, NextApiResponse } from 'next'
import { EstadoLoteModel } from "@/lib/db/almacen/estados-lote/estado-lote.model";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const estadoLoteModel = new EstadoLoteModel();
  const estadosLote = await estadoLoteModel.findMany();
  // return NextResponse.json(estadosLote);
  return res.status(200).json(estadosLote);
}