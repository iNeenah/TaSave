import { NextRequest, NextResponse } from "next/server";
import { db, users } from "@/db";
import { eq } from "drizzle-orm";
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth";

// API ROUTES: Next.js 13+ App Router permite crear APIs con archivos route.ts
// Cada función exportada corresponde a un método HTTP (GET, POST, PUT, DELETE)
export async function POST(request: NextRequest) {
  try {
    // Destructuring: Extraer propiedades específicas del objeto JSON
    const { username, password } = await request.json();

    // Validación server-side: Siempre validar en el servidor, nunca confiar solo en el cliente
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // ORM Query: Drizzle ORM para consultas type-safe a la base de datos
    const user = await db.query.users.findFirst({
      where: eq(users.username, username), // eq() es una función helper para comparaciones
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Hashing: Nunca almacenar contraseñas en texto plano, siempre hasheadas
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // JWT: JSON Web Token para autenticación stateless
    const token = await createToken(user.id);
    await setAuthCookie(token); // HttpOnly cookie para seguridad

    // Rest operator: Excluir propiedades sensibles de la respuesta
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}