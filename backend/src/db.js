import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: `${__dirname}/../../.env` });

const uri = process.env.MONGO_URI_DIRECT || process.env.MONGO_URI;
const dbName = process.env.MONGO_DB ;

if (!uri) throw new Error("MONGO_URI missing");

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });

export async function connectDb() {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  const db = client.db(dbName);
  const records = db.collection("records");
  await records.createIndex({ email: 1, session_number: 1 });
  await records.createIndex({ email: 1 });
  await records.createIndex({ user_id: 1 });
  return { db, records };
}
