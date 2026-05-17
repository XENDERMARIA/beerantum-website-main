const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const Advisor = require("../models/Advisor");
const Publication = require("../models/Publication");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/beerantum";

async function seedDummyData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const advisorsCount = await Advisor.countDocuments();
    if (advisorsCount === 0) {
      const dummyAdvisors = [
        {
          name: "Dr. Eleanor Vance",
          title: "Quantum Information Theory Lead",
          affiliation: "Quantum Institute",
          bio: "Pioneering researcher in quantum error correction and topological quantum computing with over 20 years of experience.",
          photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60",
          order: 1,
        },
        {
          name: "Prof. Alan Turing (AI)",
          title: "Algorithmic Complexity Advisor",
          affiliation: "Tech University",
          bio: "Specializes in integrating classical and quantum algorithms to solve complex optimization problems.",
          photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60",
          order: 2,
        },
        {
          name: "Dr. Sarah Chen",
          title: "Hardware Integration Specialist",
          affiliation: "NanoTech Labs",
          bio: "Expert in superconducting qubits and scalable quantum hardware architectures.",
          photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60",
          order: 3,
        }
      ];
      await Advisor.insertMany(dummyAdvisors);
      console.log(`🎓 Seeded ${dummyAdvisors.length} dummy advisors!`);
    } else {
      console.log(`ℹ️ Already have ${advisorsCount} advisors. Skipping advisor seed.`);
    }

    const pubCount = await Publication.countDocuments();
    if (pubCount === 0) {
      const dummyPublications = [
        {
          title: "Quantum-Inspired Algorithms for Public Transit Optimization",
          authors: ["Rudraksh Sharma", "Ziwoong Jang", "Van Binh Vu"],
          publishedIn: "Journal of Quantum Applied Sciences",
          year: 2026,
          abstract: "This paper explores the application of quantum-inspired decomposition methods to solve large-scale crew scheduling problems for metropolitan transit networks, demonstrating significant efficiency gains over classical heuristics.",
          url: "https://example.com/publication1",
          doi: "10.1234/jqas.2026.001",
          tags: ["optimization", "transit", "quantum-inspired"],
          order: 1,
        },
        {
          title: "Scalable Error Mitigation in Noisy Intermediate-Scale Quantum (NISQ) Devices",
          authors: ["Dinh Nhu Duc", "Viet-Anh Tran"],
          publishedIn: "Quantum Computing Review",
          year: 2025,
          abstract: "We present a novel error mitigation framework designed for NISQ architectures, reducing gate errors by up to 15% in complex variational quantum circuits.",
          doi: "10.1234/qcr.2025.042",
          tags: ["error-mitigation", "NISQ", "algorithms"],
          order: 2,
        },
      ];
      await Publication.insertMany(dummyPublications);
      console.log(`📚 Seeded ${dummyPublications.length} dummy publications!`);
    } else {
       console.log(`ℹ️ Already have ${pubCount} publications. Skipping publication seed.`);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seedDummyData();
