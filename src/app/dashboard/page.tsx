import { redirect } from "next/navigation";
import { db, machines, favorites, todos, reviews } from "@/db";
import { eq, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { canUploadMachines } from "@/lib/auth-roles";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  // Get all machines with user's favorites, todos, and review counts
  const machinesWithData = await db
    .select({
      machine: machines,
      isFavorited: sql<boolean>`CASE WHEN ${favorites.id} IS NOT NULL THEN true ELSE false END`,
      isInTodo: sql<boolean>`CASE WHEN ${todos.id} IS NOT NULL THEN true ELSE false END`,
      reviewCount: sql<number>`COUNT(${reviews.id})`,
      averageRating: sql<number>`COALESCE(AVG(${reviews.rating})::numeric, 0)`,
    })
    .from(machines)
    .leftJoin(
      favorites,
      sql`${favorites.machineId} = ${machines.id} AND ${favorites.userId} = ${user.id}`
    )
    .leftJoin(
      todos,
      sql`${todos.machineId} = ${machines.id} AND ${todos.userId} = ${user.id}`
    )
    .leftJoin(reviews, eq(reviews.machineId, machines.id))
    .groupBy(
      machines.id,
      machines.name,
      machines.description,
      machines.difficulty,
      machines.image,
      machines.downloadLink,
      machines.creationDate,
      machines.author,
      machines.createdAt,
      machines.updatedAt,
      favorites.id,
      todos.id
    )
    .orderBy(sql`${machines.createdAt} DESC`);

  // Check if user can upload machines
  const canUpload = await canUploadMachines();

  console.log(`Dashboard: Found ${machinesWithData.length} machines for user ${user.username}`);

  return (
    <DashboardClient 
      machinesWithData={machinesWithData} 
      username={user.username}
      canUploadMachines={canUpload}
    />
  );
}
