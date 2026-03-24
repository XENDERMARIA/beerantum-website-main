

const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });

const User = require("../models/User");
const TeamMember = require("../models/TeamMember");
const Event = require("../models/Event");
const Partner = require("../models/Partner");
const Content = require("../models/Content");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/beerantum";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    
    const adminEmail = process.env.ADMIN_EMAIL || "admin@beerantum.com";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: process.env.ADMIN_NAME || "Beerantum Admin",
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || "Admin@123456",
        role: "admin",
      });
      console.log(`✅ Admin user created: ${admin.email}`);
    } else {
      console.log(`⚠️  Admin user already exists: ${admin.email}`);
    }

    
    const teamCount = await TeamMember.countDocuments();
    if (teamCount === 0) {
      await TeamMember.insertMany([
        { name: "Aria Quantum", role: "Founder & CEO", education: "MIT — Quantum Computing PhD", bio: "Pioneering researcher in quantum algorithms.", isLeadership: true, order: 1, createdBy: admin._id },
        { name: "Zara Chen", role: "Lead Quantum Researcher", education: "Caltech — Physics MSc", bio: "Specialist in quantum error correction.", isLeadership: true, order: 2, createdBy: admin._id },
        { name: "Marcus Osei", role: "Head of Innovation", education: "Stanford — Computer Science BSc", bio: "Full-stack developer turned quantum engineer.", order: 3, createdBy: admin._id },
        { name: "Leila Nazari", role: "Quantum Software Engineer", education: "ETH Zürich — Quantum Information MSc", bio: "Expert in Qiskit and PennyLane.", order: 4, createdBy: admin._id },
        { name: "Dmitri Volkov", role: "Workshop Lead", education: "Oxford — Theoretical Physics DPhil", bio: "Makes quantum mechanics approachable.", order: 5, createdBy: admin._id },
        { name: "Sofia Torres", role: "Community & Outreach", education: "UC Berkeley — EECS BSc", bio: "Grows the Beerantum community.", order: 6, createdBy: admin._id },
      ]);
      console.log("✅ Sample team members created");
    }

    
    const eventsCount = await Event.countDocuments();
    if (eventsCount === 0) {
      await Event.insertMany([
        {
          title: "Quantum Hackathon 2026",
          date: new Date("2026-03-15T09:00:00"),
          endDate: new Date("2026-03-17T18:00:00"),
          timeDisplay: "9:00 AM – 6:00 PM",
          location: "MIT Campus, Cambridge, MA",
          audience: ["Students", "Researchers", "Quantum Enthusiasts"],
          description: "A 48-hour hackathon focused on building quantum algorithms and applications.",
          tags: ["Algorithms", "QML", "VQE", "QAOA"],
          status: "upcoming",
          registrationUrl: "https://example.com/register",
          maxAttendees: 200,
          createdBy: admin._id,
        },
        {
          title: "Quantum Computing Workshop Series",
          date: new Date("2026-04-05T14:00:00"),
          endDate: new Date("2026-04-05T18:00:00"),
          timeDisplay: "2:00 PM – 6:00 PM",
          location: "Virtual — Zoom",
          audience: ["Beginners", "Students"],
          description: "Hands-on workshop covering quantum fundamentals.",
          tags: ["Fundamentals", "Qiskit"],
          status: "upcoming",
          createdBy: admin._id,
        },
        {
          title: "Quantum Computing Summit 2025",
          date: new Date("2025-11-10T09:00:00"),
          endDate: new Date("2025-11-12T17:00:00"),
          location: "ETH Zürich, Switzerland",
          audience: ["Researchers", "Industry Leaders"],
          description: "Three-day summit on the future of quantum technology.",
          tags: ["Algorithms", "Error Correction"],
          status: "past",
          createdBy: admin._id,
        },
      ]);
      console.log("✅ Sample events created");
    }

    
    const partnersCount = await Partner.countDocuments();
    if (partnersCount === 0) {
      await Partner.insertMany([
        { name: "IBM", logoText: "IBM", website: "https://ibm.com/quantum", tier: "platinum", order: 1, createdBy: admin._id },
        { name: "Qiskit", logoText: "Qiskit", website: "https://qiskit.org", tier: "gold", order: 2, createdBy: admin._id },
        { name: "Microsoft", logoText: "Microsoft", website: "https://azure.microsoft.com/quantum", tier: "platinum", order: 3, createdBy: admin._id },
      ]);
      console.log("✅ Sample partners created");
    }

    
    const contentDocs = [
      {
        key: "hero",
        section: "Hero Section",
        data: {
          headline: "Welcome to Beerantum!",
          subtext: "We are Timecap, a quantum computing team that fuses Beerus' transformative force with Schrödinger's quantum principle.",
          tagline: "Go beyond what is possible.",
          stats: [{ value: "20+", label: "Workshops" }, { value: "500+", label: "Participants" }, { value: "3+", label: "Awards" }],
        },
      },
      {
        key: "mission",
        section: "Mission Section",
        data: {
          title: "Our Mission",
          text: "To be the leading force in innovation, education and competition in the field of quantum computing. We don't just face challenges — we redefine them.",
          points: [
            "Pioneer quantum innovation through hands-on research",
            "Educate and inspire the next generation of quantum computing talent",
            "Win competitions and demonstrate quantum supremacy at global stages",
          ],
        },
      },
      {
        key: "whatWeDo",
        section: "What We Do Section",
        data: {
          title: "What We Do?",
          description: "We promote hackathons, workshops and pioneering events in quantum computing.",
        },
      },
      {
        key: "coreValues",
        section: "Core Values",
        data: {
          values: [
            { title: "Innovation", description: "We relentlessly pursue novel approaches to quantum challenges." },
            { title: "Collaboration", description: "Great quantum leaps happen together." },
            { title: "Continuous Learning", description: "We commit to growing our knowledge and sharing it." },
          ],
        },
      },
    ];

    for (const doc of contentDocs) {
      await Content.findOneAndUpdate({ key: doc.key }, { ...doc, updatedBy: admin._id }, { upsert: true, new: true });
    }
    console.log("✅ Default content seeded");

    console.log("\n🎉 Seeding complete!");
    console.log(`   Admin login: ${admin.email} / ${process.env.ADMIN_PASSWORD || "Admin@123456"}`);

  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
