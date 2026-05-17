const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const Achievement = require("../models/Achievement");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/beerantum";

async function seedAchievements() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const count = await Achievement.countDocuments();
    if (count > 0) {
      console.log(`ℹ️  Already have ${count} achievements. Skipping seed.`);
      process.exit(0);
    }

    const achievements = [
      {
        title: "Berlin Kipu Quantum Hackathon 2026",
        placement: "3rd Place",
        year: 2026,
        description: "Developed a full pipeline for BVG (Berliner Verkehrsbetriebe) to optimize 30-day crew scheduling for major bus lines (M29 & M41). The solution utilized real quantum hardware via the Kipu Quantum Hub, integrating quantum-inspired decomposition methods with a custom user interface.",
        order: 1,
      },
      {
        title: "QPoland Global Hackathon 2025",
        placement: "2nd Place",
        year: 2025,
        description: "Recognized for excellence in algorithmic innovation.",
        order: 2,
      },
      {
        title: "Bradford Quantum Hackathon 2026",
        placement: "Finalist",
        year: 2026,
        description: "Competed in the United Nations International Year of Quantum event.",
        order: 3,
      },
      {
        title: "Quantum Boost 2025",
        placement: "Finalist",
        year: 2025,
        description: "Advanced to the Baltic Regional Grand Finals.",
        order: 4,
      },
    ];

    await Achievement.insertMany(achievements);
    console.log(`🏆 Seeded ${achievements.length} achievements!`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seedAchievements();
