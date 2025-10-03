'use client'

import React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { ReactNode, useRef } from "react"

interface HolographicCardProps {
  children: ReactNode
  className?: string
  intensity?: number
  glowColor?: string
}

export default function HolographicCard({ 
  children, 
  className,
  intensity = 0.5,
  glowColor = "#00ff41"
}: HolographicCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    
    x.set(xPct * intensity)
    y.set(yPct * intensity)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative rounded-xl border border-gray-800 bg-black/50 backdrop-blur-sm p-6",
        "transform-gpu perspective-1000",
        className
      )}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        boxShadow: `0 0 30px ${glowColor}30, 0 0 60px ${glowColor}15`
      }}
    >
      {/* Holographic overlay */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, 
            ${glowColor}10 0%, 
            transparent 25%, 
            ${glowColor}05 50%, 
            transparent 75%, 
            ${glowColor}10 100%)`
        }}
      />
      
      {/* Animated border gradient */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `conic-gradient(from 0deg, 
            ${glowColor}00, 
            ${glowColor}40, 
            ${glowColor}00, 
            ${glowColor}40, 
            ${glowColor}00)`
        }}
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Inner border to mask the gradient */}
      <div className="absolute inset-[1px] rounded-xl bg-black/90" />
      
      {/* Content */}
      <div 
        className="relative z-10"
        style={{
          transform: "translateZ(50px)"
        }}
      >
        {children}
      </div>
      
      {/* Reflection effect */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, 
            rgba(255,255,255,0.1) 0%, 
            transparent 50%, 
            rgba(255,255,255,0.05) 100%)`
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  )
}