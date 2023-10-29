// import { NextApiRequest, NextApiResponse } from 'next';
// import { createMongoClient } from '../../lib/db';
// import { ObjectId } from 'mongodb';
// import { getServerSession } from 'next-auth';
// import { authOptions } from './auth/[...nextauth]';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const session = await getServerSession(req, res, authOptions)

//   if (!session) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
  
//   if (req.method !== 'POST') {
//     res.status(405).end(); 
//     return;
//   }

//   const { key, newData, collection, id } = req.body;

//   if (!collection || !id || (!newData && newData !== "" ) || !key) {
//     res.status(400).json({ error: "No ID, key, collection, or newData provided" });
//     return;
//   }

//   const client = createMongoClient();

//   if (!client) {
//     res.status(500).json({ error: "Failed to create client" });
//     return;
//   }
  
//   try {
//     await client.connect();

//     const db = client.db('horizon_v2');
//     const col = db.collection(collection as string);

//     const updateResult = await col.updateOne(
//         { _id: new ObjectId(id as string) },
//         { $set: { [key]: newData } }
//     );

//     await client.close();

//     if (updateResult.modifiedCount === 1) {
//       res.status(200).json({ success: true });
//     } else {
//       res.status(404).json({ error: "Document not found or not modified" });
//     }
//   } catch (error) {
//     await client.close();
//     res.status(500).json({ error: "Server error" });
//   }
// }

// eslint-disable-next-line import/no-anonymous-default-export
export default {}