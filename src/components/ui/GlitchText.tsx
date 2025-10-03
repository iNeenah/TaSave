'use client'

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface GlitchTextProps {
  children: string
  className?: string
  intensity?: 'low' | 'medium' | 'high'
  trigger?: 'hover' | 'auto' | 'click'
  glitchChars?: string
}

export default function GlitchText({ 
  children, 
  className,
  intensity = 'medium',
  trigger = 'hover',
  glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false)
  const [glitchedText, setGlitchedText] = useState(children)

  const intensityConfig = {
    low: { duration: 100, iterations: 3 },
    medium: { duration: 150, iterations: 5 },
    high: { duration: 200, iterations: 8 }
  }

  const config = intensityConfig[intensity]

  const glitchEffect = () => {
    if (isGlitching) return
    
    setIsGlitching(true)
    let iteration = 0

    const interval = setInterval(() => {
      setGlitchedText(
        children
          .split('')
          .map((char) => {
            if (Math.random() < 0.3) {
              return glitchChars[Math.floor(Math.random() * glitchChars.length)]
            }
            return char
          })
          .join('')
      )

      iteration++
      if (iteration >= config.iterations) {
        clearInterval(interval)
        setGlitchedText(children)
        setIsGlitching(false)
      }
    }, config.duration / config.iterations)
  }

  useEffect(() => {
    if (trigger === 'auto' && typeof window !== 'undefined') {
      const autoGlitch = setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
          glitchEffect()
        }
      }, 2000)

      return () => clearInterval(autoGlitch)
    }
  }, [trigger])

  const handleInteraction = () => {
    if (trigger === 'hover' || trigger === 'click') {
      glitchEffect()
    }
  }

  return (
    <motion.span
      className={cn(
        "relative inline-block font-mono text-[#00ff41] cursor-pointer",
        className
      )}
      onMouseEnter={trigger === 'hover' ? handleInteraction : undefined}
      onClick={trigger === 'click' ? handleInteraction : undefined}
      whileHover={trigger === 'hover' ? { scale: 1.05 } : undefined}
    >
      {/* Main text */}
      <span className="relative z-10">{glitchedText}</span>
      
      {/* Glitch layers */}
      {isGlitching && (
        <>
          <motion.span
            className="absolute inset-0 text-red-400"
            animate={{
              x: [-2, 2, -1, 1, 0],
              opacity: [0, 1, 0, 1, 0]
            }}
            transition={{ duration: 0.2, repeat: 2 }}
          >
            {glitchedText}
          </motion.span>
          <motion.span
            className="absolute inset-0 text-blue-400"
            animate={{
              x: [2, -2, 1, -1, 0],
              opacity: [0, 1, 0, 1, 0]
            }}
            transition={{ duration: 0.2, repeat: 2, delay: 0.1 }}
          >
            {glitchedText}
          </motion.span>
        </>
      )}
      
      {/* Scan lines */}
      {isGlitching && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff41]/20 to-transparent"
          animate={{
            y: ['-100%', '100%']
          }}
          transition={{ duration: 0.3, repeat: 2 }}
        />
      )}
    </motion.span>
  )
}