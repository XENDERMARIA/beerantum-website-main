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
    console.log("✅ Connected to MongoDB\\n");

    // Clear existing data to replace with definitive info document
    await TeamMember.deleteMany({});
    await Event.deleteMany({});
    await Partner.deleteMany({});
    await Content.deleteMany({});
    console.log("🗑️ Cleared existing content, team, events, and partners.");

    // Ensure Admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@beerantum.com";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: process.env.ADMIN_NAME || "Beerantum Admin",
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || "Admin@123456",
        role: "admin",
        isEmailVerified: true,
        authMethod: "local",
      });
      console.log(`✅ Admin user created: ${admin.email}`);
    }

    // Insert Team Members
    await TeamMember.insertMany([
      { name: "Van Binh Vu", role: "Community Lead", education: "Core Board", isLeadership: true, order: 1, createdBy: admin._id },
      { name: "Rudraksh Sharma", role: "Tech Lead", education: "Core Board", isLeadership: true, order: 2, createdBy: admin._id },
      { name: "Ziwoong Jang", role: "Education Lead", education: "Core Board", isLeadership: true, order: 3, createdBy: admin._id },
      { name: "Emmanuella Adams", role: "Creative Studio Lead", education: "Core Board", isLeadership: true, order: 4, createdBy: admin._id },
      { name: "Dinh Nhu Duc", role: "Secretary I", education: "Core Board", isLeadership: true, order: 5, createdBy: admin._id },
      { name: "Viet-Anh (Alan) Tran", role: "Secretary II", education: "Core Board", isLeadership: true, order: 6, createdBy: admin._id },
    ]);
    console.log("✅ Seeded Team Members");

    // Insert Events (Achievements & Projects)
    await Event.insertMany([
      {
        title: "Berlin Kipu Quantum Hackathon 2026",
        date: new Date("2026-01-01T09:00:00"),
        endDate: new Date("2026-01-03T18:00:00"),
        location: "Berlin, Germany",
        description: "3rd Place. Developed a full pipeline for BVG to optimize 30-day crew scheduling for major bus lines (M29 & M41). The solution utilized real quantum hardware via the Kipu Quantum Hub, integrating quantum-inspired decomposition methods with a custom user interface.",
        tags: ["Hackathon", "Optimization", "Kipu Hub"],
        status: "past",
        audience: ["Developers"],
        createdBy: admin._id,
      },
      {
        title: "QPoland Global Hackathon 2025",
        date: new Date("2025-10-01T09:00:00"),
        endDate: new Date("2025-10-02T18:00:00"),
        location: "Global",
        description: "2nd Place. Recognized for excellence in algorithmic innovation.",
        tags: ["Hackathon", "Algorithms"],
        status: "past",
        audience: ["Developers"],
        createdBy: admin._id,
      },
      {
        title: "Bradford Quantum Hackathon 2026",
        date: new Date("2026-02-01T09:00:00"),
        endDate: new Date("2026-02-02T18:00:00"),
        location: "Bradford",
        description: "Finalist. Competed in the United Nations International Year of Quantum event.",
        tags: ["Hackathon"],
        status: "past",
        audience: ["Developers"],
        createdBy: admin._id,
      },
      {
        title: "Quantum Boost 2025",
        date: new Date("2025-11-01T09:00:00"),
        endDate: new Date("2025-11-02T18:00:00"),
        location: "Baltic Regional",
        description: "Finalist. Advanced to the Baltic Regional Grand Finals.",
        tags: ["Competition"],
        status: "past",
        audience: ["Developers"],
        createdBy: admin._id,
      },
      {
        title: "Qiskit Fall Fest @ Paris-Saclay",
        date: new Date("2025-09-01T09:00:00"),
        endDate: new Date("2025-09-07T18:00:00"),
        location: "Université Paris-Saclay",
        description: "Beerantum members organized this immersive week-long event at Université Paris-Saclay. The program featured workshops on VQE and QAOA, lab tours, and industry panels with representatives from Alice & Bob and IBM.",
        tags: ["Workshop", "Education", "Qiskit"],
        status: "past",
        audience: ["Students", "Researchers"],
        createdBy: admin._id,
      },
      {
        title: "QKorea Qbronze184",
        date: new Date("2026-01-15T09:00:00"),
        endDate: new Date("2026-01-20T18:00:00"),
        location: "South Korea / Virtual",
        description: "Beerantum co-organized and provided mentorship for this workshop in collaboration with QWorld and QKorea, delivering foundational quantum programming instruction to participants in South Korea.",
        tags: ["Workshop", "Education"],
        status: "past",
        audience: ["Students"],
        createdBy: admin._id,
      },
    ]);
    console.log("✅ Seeded Events & Achievements");

    // Insert Partners (Global Institutional Network)
    const partners = [
      { name: "Université Paris-Saclay", tier: "partner" },
      { name: "University of Oxford", tier: "partner" },
      { name: "UCLouvain", tier: "partner" },
      { name: "INSA", tier: "partner" },
      { name: "Sanofi", tier: "partner" },
      { name: "C12", tier: "partner" },
      { name: "GMV", tier: "partner" },
      { name: "KAIST (South Korea)", tier: "partner" },
      { name: "Tsinghua University (China)", tier: "partner" },
      { name: "University of Tokyo", tier: "partner" },
      { name: "RIKEN (Japan)", tier: "partner" },
      { name: "Universidade Federal de Pernambuco (Brazil)", tier: "partner" },
      { name: "Federal University Dutse (Nigeria)", tier: "partner" }
    ];
    await Partner.insertMany(partners.map((p, i) => ({ ...p, order: i + 1, createdBy: admin._id })));
    console.log("✅ Seeded Partners (Global Institutional Network)");

    // Insert Content
    const contentDocs = [
      {
        key: "hero",
        section: "Hero Section",
        data: {
          headline: "Welcome to | Beerantum!",
          subtext: "We are [p]Beerantum[/p], an international quantum computing collective founded in May 2025. We function as a bridge between theoretical quantum mechanics and industrial utility.",
          tagline: "Engineering the Quantum Ecosystem.",
        },
      },
      {
        key: "mission",
        section: "Mission Section",
        data: {
          text: "Our mission is \"Engineering the Quantum Ecosystem.\" The collective operates across three primary pillars: Research & Technical Leadership, International Education, and Media & Strategic Outreach.",
        },
      },
      {
        key: "whatWeDo",
        section: "What We Do",
        data: {
          description: "We develop hybrid quantum-classical solutions using GPUs and QPUs to address NP-hard optimization and complex forecasting problems. We serve as a global incubator for quantum talent through intensive training programs and demystify quantum computing through high-fidelity content.",
        },
      },
    ];

    for (const doc of contentDocs) {
      await Content.findOneAndUpdate({ key: doc.key }, { ...doc, updatedBy: admin._id }, { upsert: true, new: true });
    }
    console.log("✅ Seeded Content");

    console.log("\\n🎉 Seeding complete with actual Beerantum Info Document!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();

