import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URL;

export const createMongoClient = () => {

  let client: MongoClient | null = null;

   client = new MongoClient(uri as string, {
    serverApi: {
      version: "1", 
      strict: true,
      deprecationErrors: true,
    },
  });

  if (client) {
    return client;
  } else return undefined
}
