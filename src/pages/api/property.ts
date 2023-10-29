import type { NextApiRequest, NextApiResponse } from 'next';
import { createMongoClient } from '../../lib/db';
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

  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const { propertyName, agent } = req.body;

  if (
    typeof propertyName !== 'string' || 
    propertyName.trim() === '' || 
    typeof agent !== 'string' || 
    agent.trim() === '' 
  ) {
    res.status(400).json({ error: "Invalid input data" });
    return;
  }

  const client = createMongoClient();

  if (!client) {
    res.status(500).json({ error: "Could not connect to mongo db" });
    return;
  }

  await client.connect();

  const db = client.db('horizon_v3');
  const propertiesCollection = db.collection('properties');

  const uploaded_at = Math.floor(Date.now() / 1000);

  const existingProperty = await propertiesCollection.findOne({ property_name: propertyName });

  if (existingProperty) {
    res.status(409).json({ error: "Property with this name already exists" });
    await client.close();
    return;
  }

  try {
    const result = await propertiesCollection.insertOne({ property_name: propertyName, agent, uploaded_at});
    await client.close();
  
    res.status(200).json({ insertedId: result.insertedId });
  } catch (error: any) {
    await client.close();
    res.status(500).json({ error: "Failed to insert property", details: error.message });
  }
}