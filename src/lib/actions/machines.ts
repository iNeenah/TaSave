"use server";

import { revalidatePath } from "next/cache";
import { db, favorites, todos, reviews, machines } from "@/db";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { handleFormError } from "@/lib/utils";
import { requirePermission } from "@/lib/auth-roles";

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

export async function uploadMachine(formData: FormData) {
  try {
    // Check authentication and permissions
    await requirePermission('UPLOAD_MACHINE');
    
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "You must be logged in to upload machines" };
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const difficulty = formData.get("difficulty") as string;
    const downloadLink = formData.get("downloadLink") as string;
    const image = formData.get("image") as string;
    const creationDate = formData.get("creationDate") as string;

    // Validaciones
    if (!name || !difficulty || !downloadLink) {
      return { success: false, error: "Name, difficulty, and download link are required" };
    }

    const validDifficulties = ["very_easy", "easy", "medium", "hard"];
    if (!validDifficulties.includes(difficulty)) {
      return { success: false, error: "Invalid difficulty level" };
    }

    // Validar URLs
    try {
      new URL(downloadLink);
    } catch {
      return { success: false, error: "Invalid download link URL" };
    }

    if (image && image.trim()) {
      try {
        new URL(image);
      } catch {
        return { success: false, error: "Invalid image URL" };
      }
    }

    const machineData = {
      name: name.trim(),
      description: description?.trim() || null,
      difficulty: difficulty as "very_easy" | "easy" | "medium" | "hard",
      downloadLink: downloadLink.trim(),
      image: image?.trim() || null,
      creationDate: creationDate || new Date().toISOString().split('T')[0],
      author: user.username,
    };

    // Crear la máquina
    const newMachine = await db.insert(machines).values(machineData).returning();

    // Revalidar páginas relevantes
    revalidatePath("/dashboard");
    revalidatePath("/upload");
    revalidatePath("/");

    return { success: true, machine: newMachine[0] };
  } catch (error) {
    console.error("Error uploading machine:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
