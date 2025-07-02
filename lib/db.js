const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGO_URI;
const DB_NAME = "your_db_name";

let client;
let db;

async function connectToDatabase() {
  if (db) return db;

  client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db = client.db(DB_NAME);
  return db;
}

async function getAllEmails() {
  const db = await connectToDatabase();
  const emails = await db
    .collection("emails")
    .find({}, { projection: { email: 1, _id: 0 } })
    .toArray();

  return emails.map((e) => e.email);
}

module.exports = {
  connectToDatabase,
  getAllEmails,
};
