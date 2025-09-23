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
    <div className="min-h-screen dashboard-background">
      {/* Dashboard Background Overlay */}
      <div className="dashboard-overlay" />
      
      <div className="relative z-10 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-500 font-mono">
          &gt; Dashboard
        </h1>
        <p className="mt-2 text-green-400 font-mono">
          Welcome back, <span className="text-green-300">{user.username}</span>! Explore cybersecurity machines below.
        </p>
      </div>

      {machinesWithData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <span className="text-6xl">🐳</span>
            <h3 className="mt-4 text-lg font-medium text-green-500 font-mono">
              No machines available
            </h3>
            <p className="mt-2 text-green-400 font-mono">
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
    </div>
  );
}
