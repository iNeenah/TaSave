import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export async function handleFormError(error: unknown, redirectPath?: string): Promise<never> {
  console.error('Form error:', error)
  
  // En un entorno de producción, aquí podrías enviar el error a un servicio de logging
  // como Sentry, LogRocket, etc.
  
  if (redirectPath) {
    // Si se proporciona una ruta de redirección, podrías redirigir con un mensaje de error
    // Por ahora solo logueamos el error
    console.error(`Error occurred, would redirect to: ${redirectPath}`)
  }
  
  // Lanzar el error para que pueda ser manejado por el componente que llama
  if (error instanceof Error) {
    throw error
  } else {
    throw new Error('An unexpected error occurred')
  }
}