"use server";

import { redirect } from "next/navigation";

export async function handleFormError(
  error: unknown,
  redirectPath: string = "/"
) {
  console.error("Form error:", error);

  // In a real application, you might want to:
  // 1. Log to a proper logging service
  // 2. Send error notifications
  // 3. Store errors in a database for monitoring

  // For now, we'll just redirect with a simple error handling
  redirect(redirectPath);
}
