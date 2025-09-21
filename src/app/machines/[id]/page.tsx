import { notFound } from "next/navigation";
import { db, machines, favorites, todos, reviews, users } from "@/db";
import { eq, sql } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import MachineCard from "@/components/MachineCard";
import ReviewForm from "@/components/ReviewForm";
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
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Machine Info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {machine.name}
                </h1>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    machine.difficulty === "very_easy"
                      ? "bg-green-100 text-green-800"
                      : machine.difficulty === "easy"
                      ? "bg-blue-100 text-blue-800"
                      : machine.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {machine.difficulty === "very_easy"
                    ? "Very Easy"
                    : machine.difficulty === "easy"
                    ? "Easy"
                    : machine.difficulty === "medium"
                    ? "Medium"
                    : "Hard"}
                </span>
              </div>

              {machine.description && (
                <p className="text-gray-600 mb-6">{machine.description}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {machine.author && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Author
                    </dt>
                    <dd className="text-sm text-gray-900">{machine.author}</dd>
                  </div>
                )}
                {machine.creationDate && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Created
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {machine.creationDate}
                    </dd>
                  </div>
                )}
              </div>

              {machine.downloadLink && (
                <div className="mb-6">
                  <a
                    href={machine.downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Download Machine
                  </a>
                </div>
              )}

              {/* Review Statistics */}
              {stats && stats.count > 0 && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Reviews
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-xl">★</span>
                      <span className="ml-1 text-sm text-gray-600">
                        {Number(stats.average || 0).toFixed(1)} ({stats.count}{" "}
                        reviews)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews List */}
          {machineReviews.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                All Reviews
              </h3>
              <div className="space-y-4">
                {machineReviews.map(({ review, user }) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">
                        {user.username}
                      </span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    {review.text && (
                      <p className="text-gray-600 text-sm">{review.text}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Machine Card for Actions */}
          <MachineCard
            machine={machine}
            isFavorited={userFavorite}
            isInTodo={userTodo}
            userReviewCount={stats?.count || 0}
            averageRating={stats?.average || 0}
          />

          {/* Review Form */}
          {user && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {userReview ? "Update Your Review" : "Leave a Review"}
              </h3>
              <ReviewForm
                machineId={machineId}
                existingReview={
                  userReview
                    ? { rating: userReview.rating, text: userReview.text }
                    : undefined
                }
              />
            </div>
          )}

          {!user && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-600 mb-4">
                Sign in to leave reviews and manage your lists
              </p>
              <Link
                href="/signin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
