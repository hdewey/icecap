import { NextApiRequest, NextApiResponse } from "next";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

import { createMongoClient } from "../../../lib/db";
import { ObjectId } from "mongodb";

import { Property } from "../../../utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

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

  const propertyInfo = propertyInfoArray[0] as Property;
  const stepperState = getStepperState(propertyInfo);

  res.status(200).json({ property: propertyInfo, stepperState });
}

type StepperState = {
  step: number,
  name: string
}

function getStepperState(property: Property): StepperState {
  if (property.descriptions.length === 0) {
    return {
      step: 1,
      name: 'describe'
    }
  }
  return {
    step: 2,
    name: 'finished'
  }
}