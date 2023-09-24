// import { ObjectId } from "mongodb";
// import { NextApiRequest, NextApiResponse } from "next";
// import { createMongoClient } from "../../lib/db";

// const serverSideEvents = (req: NextApiRequest, res: NextApiResponse) => {
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");
//   res.flushHeaders();

//   const propertyId = req.query.propertyId;

//   setInterval(async () => {
//     const data = await fetchPropertyInfo(propertyId as string);
//     res.write(`data: ${JSON.stringify(data)}\n\n`);
//   }, 3000);

//   req.on("close", () => {
//     res.end();
//   });
// };

// export default serverSideEvents;

// const fetchPropertyInfo = async (propertyId: string) => {
//   const client = createMongoClient();

//   if (!client) {
//     return;
//   }

//   await client.connect();

//   const db = client.db('horizon_v2');
//   const propertiesCollection = db.collection('properties');

//   const propertyInfoArray = await propertiesCollection.aggregate([
//     { $match: { _id: new ObjectId(propertyId as string) } }, 
//     {
//       $lookup: {
//         from: "transcripts",
//         localField: "_id",
//         foreignField: "property_id",
//         as: "transcripts"
//       }
//     },
//     {
//       $lookup: {
//         from: "descriptions",
//         localField: "_id",
//         foreignField: "property_id",
//         as: "descriptions"
//       }
//     }
//   ]).toArray();

//   await client.close();

//   return propertyInfoArray[0];
// }

export {}