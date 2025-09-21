"use server";

import { revalidatePath } from "next/cache";
import { db, favorites, todos, reviews } from "@/db";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { handleFormError } from "@/lib/utils";

export async function toggleFavorite(machineId: number) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("You must be logged in to favorite machines");
    }

    // Check if already favorited
    const existingFavorite = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.userId, user.id),
        eq(favorites.machineId, machineId)
      ),
    });

    if (existingFavorite) {
      // Remove from favorites
      await db
        .delete(favorites)
        .where(
          and(eq(favorites.userId, user.id), eq(favorites.machineId, machineId))
        );
    } else {
      // Add to favorites
      await db.insert(favorites).values({
        userId: user.id,
        machineId,
      });
    }

    // Revalidate relevant pages
    revalidatePath("/dashboard");
    revalidatePath("/favorites");
    revalidatePath(`/machines/${machineId}`);
  } catch (error) {
    await handleFormError(error);
  }
}

export async function toggleTodo(machineId: number) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error(
        "You must be logged in to add machines to your todo list"
      );
    }

    // Check if already in todos
    const existingTodo = await db.query.todos.findFirst({
      where: and(eq(todos.userId, user.id), eq(todos.machineId, machineId)),
    });

    if (existingTodo) {
      // Remove from todos
      await db
        .delete(todos)
        .where(and(eq(todos.userId, user.id), eq(todos.machineId, machineId)));
    } else {
      // Add to todos
      await db.insert(todos).values({
        userId: user.id,
        machineId,
      });
    }

    // Revalidate relevant pages
    revalidatePath("/dashboard");
    revalidatePath("/todos");
    revalidatePath(`/machines/${machineId}`);
  } catch (error) {
    await handleFormError(error);
  }
}

export async function createReview(
  machineId: number,
  rating: number,
  text?: string
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("You must be logged in to leave reviews");
    }

    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Check if user already reviewed this machine
    const existingReview = await db.query.reviews.findFirst({
      where: and(eq(reviews.userId, user.id), eq(reviews.machineId, machineId)),
    });

    if (existingReview) {
      // Update existing review
      await db
        .update(reviews)
        .set({
          rating: rating as 1 | 2 | 3 | 4 | 5,
          text: text || null,
          updatedAt: new Date(),
        })
        .where(eq(reviews.id, existingReview.id));
    } else {
      // Create new review
      await db.insert(reviews).values({
        userId: user.id,
        machineId,
        rating: rating as 1 | 2 | 3 | 4 | 5,
        text: text || null,
      });
    }

    // Revalidate relevant pages
    revalidatePath("/dashboard");
    revalidatePath(`/machines/${machineId}`);
  } catch (error) {
    await handleFormError(error);
  }
}

export async function deleteReview(reviewId: number) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("You must be logged in to delete reviews");
    }

    // Check if review belongs to user
    const review = await db.query.reviews.findFirst({
      where: and(eq(reviews.id, reviewId), eq(reviews.userId, user.id)),
    });

    if (!review) {
      throw new Error(
        "Review not found or you don't have permission to delete it"
      );
    }

    await db.delete(reviews).where(eq(reviews.id, reviewId));

    // Revalidate relevant pages
    revalidatePath("/dashboard");
    revalidatePath(`/machines/${review.machineId}`);
  } catch (error) {
    await handleFormError(error);
  }
}
