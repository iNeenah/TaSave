import { redirect } from "next/navigation";
import { db, machines, favorites, todos } from "@/db";
import { eq, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import FavoritesClient from "@/components/FavoritesClient";

export default async function FavoritesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  // Get user's favorite machines
  const favoriteMachines = await db
    .select({
      machine: machines,
      isFavorited: sql<boolean>`true`,
      isInTodo: sql<boolean>`CASE WHEN ${todos.id} IS NOT NULL THEN true ELSE false END`,
      reviewCount: sql<number>`0`,
      averageRating: sql<number>`0`,
    })
    .from(favorites)
    .innerJoin(machines, eq(favorites.machineId, machines.id))
    .leftJoin(
      todos,
      sql`${todos.machineId} = ${machines.id} AND ${todos.userId} = ${user.id}`
    )
    .where(eq(favorites.userId, user.id))
    .groupBy(machines.id, todos.id)
    .orderBy(machines.createdAt);

  return <FavoritesClient favoriteMachines={favoriteMachines} />;
}