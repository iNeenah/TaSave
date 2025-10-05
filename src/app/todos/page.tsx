import { redirect } from "next/navigation";
import { db, machines, todos, favorites } from "@/db";
import { eq, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import TodosClient from "@/components/TodosClient";

export default async function TodosPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  // Get user's todo machines
  const todoMachines = await db
    .select({
      machine: machines,
      isFavorited: sql<boolean>`CASE WHEN ${favorites.id} IS NOT NULL THEN true ELSE false END`,
      isInTodo: sql<boolean>`true`,
      reviewCount: sql<number>`0`,
      averageRating: sql<number>`0`,
    })
    .from(todos)
    .innerJoin(machines, eq(todos.machineId, machines.id))
    .leftJoin(
      favorites,
      sql`${favorites.machineId} = ${machines.id} AND ${favorites.userId} = ${user.id}`
    )
    .where(eq(todos.userId, user.id))
    .groupBy(machines.id, favorites.id)
    .orderBy(machines.createdAt);

  return <TodosClient todoMachines={todoMachines} />;
}