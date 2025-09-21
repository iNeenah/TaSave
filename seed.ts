import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./src/db/schema";
import { hashPassword } from "./src/lib/auth";

// Database connection
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/dockerlabs";

// TypeScript interfaces for API response
interface DockerLabsApiResponse {
  info_maquinas: DockerLabsMachineItem[];
}

interface DockerLabsMachineItem {
  nombre: string;
  imagen?: string;
  enlace_descarga?: string;
  fecha?: string;
  autor?: string;
  dificultad?: string;
}

interface MachineData {
  name: string;
  image: string | null;
  downloadLink: string | null;
  creationDate: string | null;
  author: string | null;
  difficulty: string | null;
}

// Fetch real-time machine data from DockerLabs API
async function fetchDockerLabsMachines(): Promise<MachineData[]> {
  try {
    console.log("🌐 Fetching latest machine data from DockerLabs API...");
    const response = await fetch("https://dockerlabs.es/api");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as DockerLabsApiResponse;

    // Extract machine data from the API response
    const machines: MachineData[] = [];

    // The API returns an object with 'info_maquinas' property containing an array
    if (data && data.info_maquinas && Array.isArray(data.info_maquinas)) {
      data.info_maquinas.forEach((item: DockerLabsMachineItem) => {
        if (item.nombre && typeof item.nombre === "string") {
          machines.push({
            name: item.nombre,
            image: item.imagen || null,
            downloadLink: item.enlace_descarga || null,
            creationDate: item.fecha || null,
            author: item.autor || null,
            difficulty: item.dificultad || null,
          });
        }
      });
    }

    console.log(`✅ Found ${machines.length} machines from API`);

    return machines;
  } catch (error) {
    console.error("❌ Failed to fetch machine data from API:", error);
    console.log("🔄 Falling back to static machine list...");

    // Fallback to a basic list if API fails
    const fallbackMachines: MachineData[] = [
      {
        name: "Patriaquerida",
        image: null,
        downloadLink: null,
        creationDate: null,
        author: null,
        difficulty: "Fácil",
      },
      {
        name: "cineHack",
        image: null,
        downloadLink: null,
        creationDate: null,
        author: null,
        difficulty: "Medio",
      },
      {
        name: "Insanity",
        image: null,
        downloadLink: null,
        creationDate: null,
        author: null,
        difficulty: "Difícil",
      },
      {
        name: "Seeker",
        image: null,
        downloadLink: null,
        creationDate: null,
        author: null,
        difficulty: "Medio",
      },
      {
        name: "Lifeordead",
        image: null,
        downloadLink: null,
        creationDate: null,
        author: null,
        difficulty: "Difícil",
      },
      {
        name: "sjd",
        image: null,
        downloadLink: null,
        creationDate: null,
        author: null,
        difficulty: "Muy Fácil",
      },
      {
        name: "Unrecover",
        image: null,
        downloadLink: null,
        creationDate: null,
        author: null,
        difficulty: "Medio",
      },
      {
        name: "Tproot",
        image: null,
        downloadLink: null,
        creationDate: null,
        author: null,
        difficulty: "Muy Fácil",
      },
      {
        name: "Internship",
        image: null,
        downloadLink: null,
        creationDate: null,
        author: null,
        difficulty: "Fácil",
      },
      {
        name: "Walking Dead",
        image: null,
        downloadLink: null,
        creationDate: null,
        author: null,
        difficulty: "Fácil",
      },
    ];

    return fallbackMachines;
  }
}

// Map Spanish difficulty values from API to English enum values
const mapDifficulty = (
  spanishDifficulty: string | null
): "very_easy" | "easy" | "medium" | "hard" => {
  if (!spanishDifficulty) return "very_easy";

  const difficulty = spanishDifficulty.toLowerCase().trim();

  switch (difficulty) {
    case "muy fácil":
    case "muy facil":
    case "very easy":
      return "very_easy";
    case "fácil":
    case "facil":
    case "easy":
      return "easy";
    case "medio":
    case "medium":
    case "intermedio":
    case "intermediate":
      return "medium";
    case "difícil":
    case "dificil":
    case "hard":
      return "hard";
    default:
      console.warn(
        `Unknown difficulty: ${spanishDifficulty}, defaulting to very_easy`
      );
      return "very_easy";
  }
};

async function main() {
  console.log(
    "🌱 Starting database seeding with real-time DockerLabs machines..."
  );

  // Fetch the latest machine data from the API
  const dockerLabsMachines = await fetchDockerLabsMachines();

  // Create the connection
  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  try {
    // Clear existing data
    console.log("🔄 Clearing existing data...");
    await db.delete(schema.todos);
    await db.delete(schema.favorites);
    await db.delete(schema.reviews);
    await db.delete(schema.machines);
    await db.delete(schema.users);

    // Create users with properly hashed passwords
    console.log("👤 Creating users with hashed passwords...");
    const userData = [
      { username: "admin", password: "admin123" },
      { username: "john_doe", password: "password123" },
      { username: "jane_smith", password: "securepass456" },
      { username: "bob_wilson", password: "mypassword789" },
      { username: "alice_johnson", password: "strongpass321" },
    ];

    for (const user of userData) {
      const hashedPassword = await hashPassword(user.password);
      await db.insert(schema.users).values({
        username: user.username,
        password: hashedPassword,
      });
    }

    // Create machines manually
    console.log("🖥️ Creating machines...");
    for (const machine of dockerLabsMachines) {
      await db.insert(schema.machines).values({
        name: machine.name,
        description:
          "A DockerLabs penetration testing machine with various security challenges.",
        difficulty: mapDifficulty(machine.difficulty),
        image: null,
        downloadLink: machine.downloadLink ?? undefined,
        creationDate: machine.creationDate ?? undefined,
        author: machine.author ?? undefined,
      });
    }

    // Create some sample reviews, favorites, and todos
    console.log("📝 Creating sample data...");
    const createdUsers = await db.query.users.findMany();
    const createdMachines = await db.query.machines.findMany();

    // Create reviews
    const reviewTexts = [
      "Great learning experience!",
      "Too difficult for beginners.",
      "Perfect difficulty level.",
      "Could use more documentation.",
      "Excellent hands-on practice.",
    ];

    for (let i = 0; i < 25; i++) {
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomMachine =
        createdMachines[Math.floor(Math.random() * createdMachines.length)];
      const randomRating = (Math.floor(Math.random() * 5) + 1) as
        | 1
        | 2
        | 3
        | 4
        | 5;
      const randomText =
        reviewTexts[Math.floor(Math.random() * reviewTexts.length)];

      await db.insert(schema.reviews).values({
        userId: randomUser.id,
        machineId: randomMachine.id,
        rating: randomRating,
        text: randomText,
      });
    }

    // Create favorites
    for (let i = 0; i < 20; i++) {
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomMachine =
        createdMachines[Math.floor(Math.random() * createdMachines.length)];

      await db.insert(schema.favorites).values({
        userId: randomUser.id,
        machineId: randomMachine.id,
      });
    }

    // Create todos
    for (let i = 0; i < 15; i++) {
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomMachine =
        createdMachines[Math.floor(Math.random() * createdMachines.length)];

      await db.insert(schema.todos).values({
        userId: randomUser.id,
        machineId: randomMachine.id,
      });
    }

    console.log("✅ Database seeded successfully!");
    console.log("📊 Created:");
    console.log(`   - 5 users`);
    console.log(
      `   - ${dockerLabsMachines.length} real-time DockerLabs machines`
    );
    console.log("   - 25 reviews");
    console.log("   - 20 favorites");
    console.log("   - 15 todos");
    console.log("\n🎯 All machines fetched live from DockerLabs API!");
    console.log("🔄 Run this script anytime to get the latest machines!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
