//connect mongodb driver no schema

const { MongoClient, ServerApiVersion } = require("mongodb");

const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URL, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    console.log("mongo url is ", process.env.MONGO_URL);
    await client.connect();
    console.log("Connected successfully");
    const db = client.db(process.env.MONGO_DB_NAME);
    return db;
  } catch (error) {
    console.error(`error ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
