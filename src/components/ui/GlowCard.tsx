'use client'

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  intensity?: 'low' | 'medium' | 'high'
  animated?: boolean
}

// Tarjeta con efecto de brillo personalizable
export default function GlowCard({ 
  children, 
  className, 
  glowColor = "#00ff41", 
  intensity = 'medium',
  animated = true 
}: GlowCardProps) {
  const intensityClasses = {
    low: "shadow-lg",
    medium: "shadow-xl",
    high: "shadow-2xl"
  }

  const glowStyle = {
    boxShadow: `0 0 20px ${glowColor}20, 0 0 40px ${glowColor}10, inset 0 0 20px ${glowColor}05`
  }

  const CardComponent = animated ? motion.div : 'div'
  
  const animationProps = animated ? {
    whileHover: { 
      scale: 1.02,
      boxShadow: `0 0 30px ${glowColor}30, 0 0 60px ${glowColor}15, inset 0 0 30px ${glowColor}08`
    },
    transition: { duration: 0.3 }
  } : {}

  return (
    <CardComponent
      className={cn(
        "relative rounded-lg border border-gray-800 bg-black/50 backdrop-blur-sm p-6 transition-all duration-300 hover:border-[#00ff41]/50",
        intensityClasses[intensity],
        className
      )}
      style={glowStyle}
      {...animationProps}
    >
      {/* Brillo animado del borde */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-[#00ff41]/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
      
      {/* Contenido de la tarjeta */}
      <div className="relative z-10">
        {children}
      </div>
    </CardComponent>
  )
}