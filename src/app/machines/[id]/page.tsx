import { notFound } from "next/navigation";
import { db, machines, favorites, todos, reviews, users } from "@/db";
import { eq, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import MachineCard from "@/components/MachineCard";
import MachineFeatures from "@/components/MachineFeatures";
import ReviewsGrid from "@/components/ReviewsGrid";
import Link from "next/link";

interface MachineDetailPageProps {
  params: {
    id: string;
  };
}

export default async function MachineDetailPage({
  params,
}: MachineDetailPageProps) {
  const user = await getCurrentUser();
  const machineId = parseInt(params.id);

  if (isNaN(machineId)) {
    notFound();
  }

  // Get machine details
  const machine = await db.query.machines.findFirst({
    where: eq(machines.id, machineId),
  });

  if (!machine) {
    notFound();
  }

  let userFavorite = false;
  let userTodo = false;
  let userReview = null;

  if (user) {
    // Check if user has favorited this machine
    const favorite = await db.query.favorites.findFirst({
      where: sql`${favorites.machineId} = ${machineId} AND ${favorites.userId} = ${user.id}`,
    });
    userFavorite = !!favorite;

    // Check if user has this machine in todos
    const todo = await db.query.todos.findFirst({
      where: sql`${todos.machineId} = ${machineId} AND ${todos.userId} = ${user.id}`,
    });
    userTodo = !!todo;

    // Get user's review
    userReview = await db.query.reviews.findFirst({
      where: sql`${reviews.machineId} = ${machineId} AND ${reviews.userId} = ${user.id}`,
    });
  }

  // Get all reviews for this machine with user info
  const machineReviews = await db
    .select({
      review: reviews,
      user: {
        username: users.username,
      },
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.machineId, machineId))
    .orderBy(sql`${reviews.createdAt} DESC`);

  // Get review statistics
  const reviewStats = await db
    .select({
      count: sql<number>`COUNT(*)`,
      average: sql<number>`COALESCE(AVG(${reviews.rating})::numeric, 0)`,
    })
    .from(reviews)
    .where(eq(reviews.machineId, machineId));

  const stats = reviewStats[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-green-400 hover:text-green-300 text-sm font-medium font-mono transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Dashboard
          </Link>
        </div>

        {/* Machine Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {machine.name}
          </h1>
          {machine.description && (
            <p className="text-gray-300 text-lg max-w-3xl">
              {machine.description}
            </p>
          )}
        </div>

        <div className="space-y-8">
          {/* Machine Features Section */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Machine Overview</h2>
            <MachineFeatures machine={machine} />
          </div>

          {/* Reviews Section */}
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">Reviews & Community</h2>
            <ReviewsGrid
              machineId={machineId}
              reviews={machineReviews}
              user={user}
              userReview={userReview ? { rating: userReview.rating, text: userReview.text } : null}
              reviewStats={stats}
            />
          </div>

          {/* Sidebar Actions - Now at bottom on mobile, side on desktop */}
          <div className="lg:hidden">
            <h2 className="text-2xl font-semibold text-white mb-6">Quick Actions</h2>
            <MachineCard
              machine={machine}
              isFavorited={userFavorite}
              isInTodo={userTodo}
              userReviewCount={stats?.count || 0}
              averageRating={stats?.average || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
