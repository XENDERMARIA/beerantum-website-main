const mongoose = require("mongoose");


async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/beerantum";

  try {
    const conn = await mongoose.connect(uri, {
      
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    throw err;
  }
}


process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed (SIGINT).");
  process.exit(0);
});

module.exports = connectDB;
