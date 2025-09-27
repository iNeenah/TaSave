import ReviewForm from "./ReviewForm";
import StarRating from "./ui/StarRating";

interface Review {
  id: number;
  rating: number;
  text: string | null;
  createdAt: Date;
}

interface ReviewUser {
  username: string;
}

interface ReviewsGridProps {
  machineId: number;
  reviews: Array<{
    review: Review;
    user: ReviewUser;
  }>;
  user?: {
    id: number;
    username: string;
  } | null;
  userReview?: {
    rating: number;
    text?: string | null;
  } | null;
  reviewStats?: {
    count: number;
    average: number;
  };
}

export default function ReviewsGrid({
  machineId,
  reviews,
  user,
  userReview,
  reviewStats,
}: ReviewsGridProps) {
  return (
    <div className="space-y-8">
      {/* Review Statistics */}
      {reviewStats && reviewStats.count > 0 && (
        <div className="bg-gradient-to-b from-white/8 to-white/4 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Reviews Overview</h3>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <StarRating 
                rating={Number(reviewStats.average || 0)} 
                size="lg" 
                showValue={true}
              />
            </div>
            <span className="text-gray-400">
              Based on {reviewStats.count} review{reviewStats.count !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Review Form */}
        <div className="bg-gradient-to-b from-white/8 to-white/4 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg hover:shadow-xl hover:from-white/12 hover:border-white/20 transition-all duration-300 p-6">
          <h3 className="text-xl font-semibold text-white mb-6">
            {user ? (
              userReview ? "Update Your Review" : "Leave a Review"
            ) : (
              "Sign in to Review"
            )}
          </h3>
          
          {user ? (
            <ReviewForm
              machineId={machineId}
              existingReview={userReview || undefined}
            />
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-gray-400 mb-6">
                Sign in to leave reviews and share your experience with this machine
              </p>
              <a
                href="/signin"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign In
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Reviews List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-6">
            Community Reviews ({reviews.length})
          </h3>
          
          {reviews.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {reviews.map(({ review, user }) => (
                <div
                  key={review.id}
                  className="bg-gradient-to-b from-white/8 to-white/4 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-lg hover:shadow-xl hover:from-white/12 hover:border-white/20 transition-all duration-300"
                >
                  {/* Rating Stars */}
                  <div className="flex items-center justify-between mb-3">
                    <StarRating rating={review.rating} size="md" />
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Review Text */}
                  {review.text && (
                    <blockquote className="text-gray-300 text-sm mb-4 italic border-l-2 border-green-500/30 pl-4">
                      &ldquo;{review.text}&rdquo;
                    </blockquote>
                  )}

                  {/* Author Info */}
                  <div className="flex items-center space-x-3 pt-3 border-t border-white/10">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-black font-semibold text-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-white text-sm">
                      {user.username}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-b from-white/8 to-white/4 backdrop-blur-xl border border-white/10 rounded-xl p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-400">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}