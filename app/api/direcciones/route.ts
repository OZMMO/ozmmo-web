import type { NextApiRequest, NextApiResponse } from 'next'
import { DireccionModel } from "@/lib/db/sat/direcciones/direccion.model";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const direccion = req.query.direccion as string;
  
  if(!direccion) return res.status(400).json({ error: 'Direccion is required' });

  const direccionModel = new DireccionModel();
  const direcciones = await direccionModel.findMany(direccion);
  return res.status(200).json(direcciones);
} 