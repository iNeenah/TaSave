'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface MatrixRainProps {
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  color?: string
}

// Efecto de lluvia de Matrix con caracteres cayendo
export default function MatrixRain({ 
  className = '', 
  intensity = 'medium',
  color = '#00ff41'
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Caracteres que caen en el efecto Matrix
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?'
    const charArray = chars.split('')

    // Configuración de intensidad del efecto
    const intensityConfig = {
      low: { dropCount: 50, speed: 0.5 },
      medium: { dropCount: 100, speed: 1 },
      high: { dropCount: 200, speed: 1.5 }
    }

    const config = intensityConfig[intensity]
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = []

    // Initialize drops con seed fijo para evitar diferencias SSR/client
    for (let i = 0; i < columns; i++) {
      drops[i] = (i * 123.456) % canvas.height // Usar un patrón determinístico inicial
    }

    const draw = () => {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text properties
      ctx.fillStyle = color
      ctx.font = `${fontSize}px monospace`

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        ctx.fillText(char, x, y)

        // Reset drop when it reaches bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        // Move drop down
        drops[i] += config.speed
      }
    }

    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [intensity, color])

  return (
    <motion.canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ duration: 2 }}
    />
  )
}