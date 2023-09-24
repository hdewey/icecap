import type { NextApiRequest, NextApiResponse } from 'next';
import { createMongoClient } from '../../lib/db';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { id } = req.query;

  if (!id) {
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

  const prompts = await promptsCollection.findOne({ _id: new ObjectId(id as string)});

  await client.close();

  res.status(200).json({ prompts });
}