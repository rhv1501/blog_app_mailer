require("dotenv").config();
const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGO_URI;
const DB_NAME = "Blog-app";

if (!MONGODB_URI) {
  console.error("❌ MONGO_URI environment variable is not set");
  process.exit(1);
}

let client;
let db;

async function connectToDatabase() {
  if (db) return db;

  client = await MongoClient.connect(MONGODB_URI);

  db = client.db(DB_NAME);
  return db;
}

async function getAllEmails() {
  const db = await connectToDatabase();
  const emails = await db.collection("emails").find().toArray();
  return emails.map((e) => e.email);
}

module.exports = {
  connectToDatabase,
  getAllEmails,
};
