import type { NextApiRequest, NextApiResponse } from 'next';
import { createMongoClient } from '../../../lib/db';
import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const { prompt_id } = req.query;

  if (!prompt_id) {
    res.status(400).json({error: "No id given."})
  }

  const client = createMongoClient();

  if (!client) {
    res.status(500).json({ error: "Could not connect to mongo db" });
    return;
  }

  await client.connect();

  const db = client.db('horizon_v2');
  const promptsCollection = db.collection('prompts');

  const prompts = await promptsCollection.findOne({ _id: new ObjectId(prompt_id as string)});

  await client.close();

  res.status(200).json({ prompts });
}