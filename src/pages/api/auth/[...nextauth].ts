import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth, { AuthOptions } from 'next-auth';
import bcrypt from 'bcryptjs';

import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { createMongoClient } from '../../../lib/db';

import jwt from 'jsonwebtoken';

export interface SessionWithToken extends Session {
  accessToken?: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const client = createMongoClient();

        if (!client) {
          console.log('Error: Could not connect to MongoDB client.');
          return null;
        }

        if (!credentials) {
          console.log('Error: Missing credentials.');
          return null;
        }

        await client.connect();
        const db = client.db('horizon_v3')
      
        const user = await db.collection('users').findOne({ email: credentials.email, filled: true })

        await client.close();
      
        if (user) {
          const isValid = await bcrypt.compare(credentials.password, user.hashed_password)
          if (isValid) {
            return { id: user._id.toString(), email: user.email, name: user.username ? user.username : null };
          } else {
            return null;
          }
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }: { session: SessionWithToken; token: JWT; }) {
      const encodedToken = jwt.sign(token, process.env.JWT_SECRET as string, { algorithm: 'HS256'});
      session.accessToken = encodedToken;
      return session;
    },
    async jwt({ token, user }: { token: JWT; user: any }) {
      return token;
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  }
};

export default NextAuth(authOptions);