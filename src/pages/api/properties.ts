import type { NextApiRequest, NextApiResponse } from 'next';
import { createMongoClient } from '../../lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const client = createMongoClient();

  if (!client) {
    res.status(500).json({ error: "Could not connect to mongo db" });
    return;
  }

  await client.connect();

  const db = client.db('horizon_v3');
  const propertiesCollection = db.collection('properties');

  if (req.query.email !== 'none') {
    const allProperties = await propertiesCollection.find({ agent: decodeURIComponent(req.query.email as string)}).sort({ uploaded_at: -1 }).toArray();

    await client.close();
  
    res.status(200).json({ properties: allProperties });
  } else {
    const allProperties = await propertiesCollection.find().sort({ uploaded_at: -1 }).toArray();

    await client.close();
  
    res.status(200).json({ properties: allProperties });
  }
}