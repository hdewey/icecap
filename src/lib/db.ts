import { MongoClient } from "mongodb";

// Replace the "<connection string>" with your actual Atlas connection string
const uri = process.env.DATABASE_URL;

export const createMongoClient = () => {

  let client: MongoClient | null = null;

   // Create a new MongoClient instance
   client = new MongoClient(uri as string, {
    serverApi: {
      version: "1", // Use the desired Server API version here
      strict: true,
      deprecationErrors: true,
    },
  });

  if (client) {
    return client;
  } else return undefined
}
