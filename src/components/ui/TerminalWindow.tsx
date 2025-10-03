'use client'

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ReactNode, useState } from "react"
import { Minimize2, Maximize2, X } from "lucide-react"

interface TerminalWindowProps {
  children: ReactNode
  title?: string
  className?: string
  showControls?: boolean
}

export default function TerminalWindow({ 
  children, 
  title = "terminal@tasave:~$", 
  className,
  showControls = true
}: TerminalWindowProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)

  return (
    <motion.div
      className={cn(
        "bg-black border border-[#00ff41] rounded-lg overflow-hidden shadow-2xl",
        "shadow-[0_0_20px_rgba(0,255,65,0.3)]",
        isMaximized ? "fixed inset-4 z-50" : "",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Terminal Header */}
      <div className="bg-gray-900 border-b border-[#00ff41]/30 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-[#00ff41] text-sm font-mono ml-4">{title}</span>
        </div>
        
        {showControls && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-400 hover:text-[#00ff41] transition-colors"
            >
              <Minimize2 size={14} />
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-gray-400 hover:text-[#00ff41] transition-colors"
            >
              <Maximize2 size={14} />
            </button>
            <button className="text-gray-400 hover:text-red-400 transition-colors">
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Terminal Content */}
      <motion.div
        className={cn(
          "p-4 font-mono text-sm text-[#00ff41] bg-black min-h-[200px]",
          isMinimized ? "hidden" : "block"
        )}
        animate={isMinimized ? { height: 0 } : { height: "auto" }}
      >
        {/* Scanning line effect */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute left-0 right-0 h-px bg-[#00ff41]/50"
            animate={{
              top: ["0%", "100%"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Cursor */}
        <motion.span
          className="inline-block w-2 h-4 bg-[#00ff41] ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  )
}