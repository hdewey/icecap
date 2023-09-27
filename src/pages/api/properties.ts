import type { NextApiRequest, NextApiResponse } from 'next';
import { createMongoClient } from '../../lib/db';
import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
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
