import type { NextApiRequest, NextApiResponse } from 'next';
import { createMongoClient } from '../../lib/db';
import { BSON } from 'mongodb';
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
  if (req.method === 'DELETE') {

    const { id, collection } = req.query;

    if (!id || !collection) {
      res.status(400).json({ message: 'Error: Missing id or collection'});
      return
    }

    const client = createMongoClient();

    if (!client) {
      res.status(500).json({ error: "Could not connect to mongo db" });
      return;
    }

    await client.connect();

    const db = client.db('horizon_v3');
    const col = db.collection(collection as string);
    
    const result = await col.findOneAndDelete({ _id: new BSON.ObjectId(id as string) });

    if (!result) {
    res.status(400).json({ message: 'Error: This does not exist.'});
    } else {
      res.status(200).json({ message:  `${id} was deleted from ${col}`})
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed, only DELETE requests are accepted.' });
    return
  }
}