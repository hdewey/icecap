import { NextApiRequest, NextApiResponse } from "next";
import { createMongoClient } from "../../lib/db";
import bcrypt from "bcryptjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  const client = createMongoClient();
  if (!client) {
    return res.status(500).json({ message: 'Problem connecting to database' });
  }

  try {
    await client.connect();
    const myDB = client.db("horizon_v3");
    const myColl = myDB.collection("users");

    if (req.method === "POST") {
      const { email, password, invite_code, username } = req.body;

      if (!email || !password || !invite_code) {
        throw new Error('Missing fields');
      }

      const unfilled_user = await myColl.findOne({ email: invite_code, filled: false });
    
      if (unfilled_user) {
        const hashed_password = await bcrypt.hash(password, 12);
    
        const user = {
          email,
          username,
          hashed_password,
          filled: true
        };
      
        const result = await myColl.updateOne({ email: invite_code, filled: false}, { $set: user });
        console.log(`A document was updated with the _id: ${result.upsertedId}`);

        res.status(200).json({ message: "User created!"})
      } else {
        res.status(500).json({ message: "Invalid invite code" }); 
      }

    } else if (req.method === "PUT") {
      const { email, username: newUsername } = req.body;

      if (!email || !newUsername) {
        return res.status(400).json({ message: 'Missing fields' });
      }

      const result = await myColl.updateOne({ email }, { $set: { username: newUsername }});

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: 'Username updated!' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    client.close();
  }
  return;
};

export default handler;
