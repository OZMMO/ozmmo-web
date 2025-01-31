import { auth } from "@/auth";
import { CriteriaSqlServer, Ubicacion, UbicacionesModel } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from 'next'

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await auth();
  const userId = session?.user.id as string;

  const bodega_id = req.query.bodega_id as string;
  
  if(!bodega_id) return res.status(400).json({ error: 'Bodega is required' });

  const criteria = new CriteriaSqlServer<Ubicacion>();
  criteria.addConditition("bodega_id", bodega_id);
  criteria.addConditition("estatus", "1");
  criteria.addConditition("UserId", userId);
  const ubicaciones = await new UbicacionesModel().findMany(criteria);
  
  return res.status(200).json(ubicaciones);
}