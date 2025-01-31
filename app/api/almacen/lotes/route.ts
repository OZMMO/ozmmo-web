import type { NextApiRequest, NextApiResponse } from 'next'
import { LoteModel } from "@/lib/db/almacen/lotes/lote.model";
import { Lote } from "@/lib/db/almacen/lotes/lote";
import { CriteriaSqlServer } from "@/lib/db";
import { auth } from "@/auth";

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await auth();
  const userId = session?.user.id as string;

  const producto_id = req.query.producto_id as string;
  const loteModel = new LoteModel();
  const criteria = new CriteriaSqlServer<Lote>();
  criteria.addConditition('producto_id', producto_id);
  criteria.addConditition('UserId', userId);
  const lotes = await loteModel.findMany(criteria);
  
  return res.status(200).json(lotes);
}