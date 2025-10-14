import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// GET endpoint: Obtener información del usuario autenticado
export async function GET() {
  try {
    // Middleware pattern: getCurrentUser verifica JWT y devuelve usuario o null
    const user = await getCurrentUser();
    
    // Guard clause: Salida temprana si no hay usuario autenticado
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Data sanitization: Remover información sensible antes de enviar al cliente
    const { password, ...userWithoutPassword } = user;
    void password; // void operator: Marcar variable como intencionalmente no usada
    
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}