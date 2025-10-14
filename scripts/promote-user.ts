import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "../src/db/schema";
import { eq } from "drizzle-orm";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/dockerlabs";

async function promoteUser(username: string, role: 'user' | 'contributor' | 'admin') {
  try {
    const client = postgres(connectionString);
    const db = drizzle(client, { schema: { users } });

    console.log(`🔍 Looking for user: ${username}`);

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.username, username)
    });

    if (!user) {
      console.log(`❌ User '${username}' not found`);
      await client.end();
      return;
    }

    console.log(`👤 Found user: ${user.username} (current role: ${(user as any).role || 'user'})`);

    // Update user role
    const updatedUser = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, user.id))
      .returning();

    console.log(`✅ Successfully promoted ${username} to ${role}`);
    console.log(`📊 Updated user:`, {
      id: updatedUser[0].id,
      username: updatedUser[0].username,
      role: (updatedUser[0] as any).role
    });

    await client.end();
  } catch (error) {
    console.error("❌ Error promoting user:", error);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
const username = args[0];
const role = args[1] as 'user' | 'contributor' | 'admin';

if (!username || !role) {
  console.log("Usage: npx tsx scripts/promote-user.ts <username> <role>");
  console.log("Roles: user, contributor, admin");
  console.log("Example: npx tsx scripts/promote-user.ts admin admin");
  process.exit(1);
}

if (!['user', 'contributor', 'admin'].includes(role)) {
  console.log("❌ Invalid role. Must be: user, contributor, or admin");
  process.exit(1);
}

promoteUser(username, role);