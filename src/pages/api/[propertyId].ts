import type { NextApiRequest, NextApiResponse } from 'next';
import { createMongoClient } from '../../lib/db';
import { ObjectId } from 'mongodb';
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
  
  const { propertyId } = req.query;

  const client = createMongoClient();

  if (!client) {
    res.status(500).json({ error: "Could not connect to mongo db" });
    return;
  }

  await client.connect();

  const db = client.db('horizon_v2');
  const propertiesCollection = db.collection('properties');

  const propertyInfoArray = await propertiesCollection.aggregate([
    { $match: { _id: new ObjectId(propertyId as string) } }, 
    {
      $lookup: {
        from: "transcripts",
        localField: "_id",
        foreignField: "property_id",
        as: "transcripts"
      }
    },
    {
      $lookup: {
        from: "descriptions",
        localField: "_id",
        foreignField: "property_id",
        as: "descriptions"
      }
    }
  ]).toArray();

  await client.close();

  if (propertyInfoArray.length === 0) {
    res.status(404).json({ error: "Property not found" });
    return;
  }

  const propertyInfo = propertyInfoArray[0];
  res.status(200).json({ property: propertyInfo });
}