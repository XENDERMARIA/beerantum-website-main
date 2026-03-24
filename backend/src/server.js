const app = require("./app");
const connectDB = require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT || 5000;


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Beerantum API running on port ${PORT}`);
      console.log(`   Environment : ${process.env.NODE_ENV || "development"}`);
      console.log(`   Docs        : http://localhost:${PORT}/api/health\n`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
