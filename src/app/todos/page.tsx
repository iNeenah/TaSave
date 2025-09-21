import { redirect } from "next/navigation";
import { db, machines, todos, favorites } from "@/db";
import { eq, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import MachineCard from "@/components/MachineCard";
import Link from "next/link";

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

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Todo List</h1>
        <p className="mt-2 text-gray-600">Machines you want to work on</p>
      </div>

      {todoMachines.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <span className="text-6xl">📝</span>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No todos yet
            </h3>
            <p className="mt-2 text-gray-500">
              Add machines to your todo list to track your learning progress.
            </p>
            <Link
              href="/dashboard"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Machines
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {todoMachines.map(
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
                averageRating={averageRating || 0}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
