import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./src/db/schema";

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
  console.log("🌱 Starting PRODUCTION database seeding - machines only...");

  // Fetch the latest machine data from the API
  const dockerLabsMachines = await fetchDockerLabsMachines();

  // Create the connection
  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  try {
    // Only clear existing machines (preserve users, reviews, favorites, todos)
    console.log("🔄 Clearing existing machines...");
    await db.delete(schema.machines);

    // Create machines only
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

    console.log("✅ Production database seeded successfully!");
    console.log("📊 Created:");
    console.log(
      `   - ${dockerLabsMachines.length} real-time DockerLabs machines`
    );
    console.log("\n🎯 All machines fetched live from DockerLabs API!");
    console.log("🔄 Run this script anytime to get the latest machines!");
    console.log(
      "⚠️  Note: This script only seeds machines - users and other data are preserved."
    );
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
