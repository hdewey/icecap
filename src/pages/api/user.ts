import { NextApiRequest, NextApiResponse } from "next";
import { createMongoClient } from "../../lib/db";
import bcrypt from "bcryptjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  if (req.method === "POST") {

    const { email, password, invite_code } = req.body;

    if (!email || !password || !invite_code) {
      throw new Error('Missing fields');
    }
    const client = createMongoClient();

    if (!client) {
      throw new Error('Problem connecting to database')
    }

    try {

      await client.connect();

      const myDB = client.db("horizon_v2");
        const myColl = myDB.collection("users");
      
        const unfilled_user = await myColl.findOne({ email: invite_code, filled: false });
      
        if (unfilled_user) {
          const hashed_password = await bcrypt.hash(password, 12);
      
          const user = {
            email,
            hashed_password,
            filled: true
          };
        
          const result = await myColl.updateOne({ email: invite_code, filled: false}, { $set: user });
          console.log(`A document was updated with the _id: ${result.upsertedId}`);
  
          res.status(200).json({ message: "User created!"})
        } else {
          res.status(500).json({ message: "Invalid invite code" }); 
        }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message });
    } finally {
      client.close()
    }
  } else {
    res.status(405).json({ message: "Method not allowed" }); 
  }

  return;
};

export default handler;
