import type { NextApiRequest, NextApiResponse } from 'next';
import { createMongoClient } from '../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = createMongoClient();

  if (!client) {
    res.status(500).json({ error: "Could not connect to mongo db" });
    return;
  }

  await client.connect();

  const db = client.db('horizon_v2');
  const propertiesCollection = db.collection('properties');

  const allProperties = await propertiesCollection.find().sort({ uploaded_at: -1 }).toArray();

  await client.close();

  res.status(200).json({ properties: allProperties });
}