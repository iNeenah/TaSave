import { redirect } from "next/navigation";
import { db, machines, favorites, todos, reviews } from "@/db";
import { eq, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import MachineCard from "@/components/MachineCard";

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
    .groupBy(machines.id, favorites.id, todos.id)
    .orderBy(machines.createdAt);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {user.username}! Explore cybersecurity machines below.
        </p>
      </div>

      {machinesWithData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <span className="text-6xl">🐳</span>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No machines available
            </h3>
            <p className="mt-2 text-gray-500">
              Check back later for new cybersecurity challenges.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {machinesWithData.map(
            ({
              machine,
              isFavorited,
              isInTodo,
              reviewCount,
              averageRating,
            }) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                isFavorited={isFavorited}
                isInTodo={isInTodo}
                userReviewCount={reviewCount}
                averageRating={averageRating}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
