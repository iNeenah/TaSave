"use server";

import { redirect } from "next/navigation";
import { db, users } from "@/db";
import { eq } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  createToken,
  setAuthCookie,
  clearAuthCookie,
} from "@/lib/auth";
import { handleFormError } from "@/lib/utils";

export async function signup(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    if (username.length < 3) {
      throw new Error("Username must be at least 3 characters long");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (existingUser) {
      throw new Error("Username already exists");
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
      })
      .returning();

    // Create token and set cookie
    const token = await createToken(newUser.id);
    await setAuthCookie(token);

    redirect("/dashboard");
  } catch (error) {
    await handleFormError(error, "/signup");
  }
}

export async function signin(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid username or password");
    }

    // Create token and set cookie
    const token = await createToken(user.id);
    await setAuthCookie(token);

    redirect("/dashboard");
  } catch (error) {
    await handleFormError(error, "/signin");
  }
}

export async function signout() {
  try {
    await clearAuthCookie();
    redirect("/");
  } catch (error) {
    await handleFormError(error, "/");
  }
}
