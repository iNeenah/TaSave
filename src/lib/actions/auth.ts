"use server";

import { db, users } from "@/db";
import { eq } from "drizzle-orm";
import {
  hashPassword,
  verifyPassword,
  createToken,
  setAuthCookie,
  clearAuthCookie,
} from "@/lib/auth";

export async function signup(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      return { success: false, error: "Username and password are required" };
    }

    if (username.length < 3) {
      return { success: false, error: "Username must be at least 3 characters long" };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long" };
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (existingUser) {
      return { success: false, error: "Username already exists" };
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

    return { success: true, message: "Account created successfully" };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function signin(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      return { success: false, error: "Username and password are required" };
    }

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!user) {
      return { success: false, error: "Invalid username or password" };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return { success: false, error: "Invalid username or password" };
    }

    // Create token and set cookie
    const token = await createToken(user.id);
    await setAuthCookie(token);

    return { success: true, message: "Login successful" };
  } catch (error) {
    console.error("Signin error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function signout() {
  try {
    await clearAuthCookie();
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("Signout error:", error);
    return { success: false, error: "Error logging out" };
  }
}
