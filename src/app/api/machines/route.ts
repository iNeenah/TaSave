import { NextRequest, NextResponse } from "next/server";
import { db, machines } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { canUploadMachines } from "@/lib/auth-roles";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to upload machines" },
        { status: 401 }
      );
    }

    // Check if user has permission to upload machines
    const canUpload = await canUploadMachines();
    if (!canUpload) {
      return NextResponse.json(
        { error: "You don't have permission to upload machines. Contact an administrator." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      difficulty,
      downloadLink,
      image,
      creationDate
    } = body;

    // Validaciones
    if (!name || !difficulty || !downloadLink) {
      return NextResponse.json(
        { error: "Name, difficulty, and download link are required" },
        { status: 400 }
      );
    }

    // Validar dificultad
    const validDifficulties = ["very_easy", "easy", "medium", "hard"];
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { error: "Invalid difficulty. Must be: very_easy, easy, medium, or hard" },
        { status: 400 }
      );
    }

    // Validar URL de descarga
    try {
      new URL(downloadLink);
    } catch {
      return NextResponse.json(
        { error: "Invalid download link URL" },
        { status: 400 }
      );
    }

    // Validar URL de imagen si se proporciona
    if (image) {
      try {
        new URL(image);
      } catch {
        return NextResponse.json(
          { error: "Invalid image URL" },
          { status: 400 }
        );
      }
    }

    // Crear la máquina
    const newMachine = await db.insert(machines).values({
      name: name.trim(),
      description: description?.trim() || null,
      difficulty,
      downloadLink: downloadLink.trim(),
      image: image?.trim() || null,
      creationDate: creationDate || new Date().toISOString().split('T')[0],
      author: user.username,
    }).returning();

    // Revalidar páginas relevantes
    revalidatePath("/dashboard");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Machine uploaded successfully",
      machine: newMachine[0]
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating machine:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allMachines = await db.query.machines.findMany({
      orderBy: (machines, { desc }) => [desc(machines.createdAt)]
    });

    return NextResponse.json({
      success: true,
      machines: allMachines
    });

  } catch (error) {
    console.error("Error fetching machines:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}