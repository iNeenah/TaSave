'use client'

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ReactNode, useState } from "react"
import { cva, type VariantProps } from "class-variance-authority"

const hackerButtonVariants = cva(
    "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 terminal-text overflow-hidden",
    {
        variants: {
            variant: {
                default: "bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41] hover:bg-[#00ff41]/20",
                destructive: "bg-red-500/10 text-red-400 border border-red-500 hover:bg-red-500/20",
                outline: "border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/10",
                secondary: "bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-gray-700/50",
                ghost: "text-[#00ff41] hover:bg-[#00ff41]/10",
                link: "text-[#00ff41] underline-offset-4 hover:underline",
                matrix: "bg-black border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41]/5",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

interface HackerButtonProps extends VariantProps<typeof hackerButtonVariants> {
    children: ReactNode
    glitchEffect?: boolean
    className?: string
    onClick?: () => void
    disabled?: boolean
    type?: "button" | "submit" | "reset"
}

export default function HackerButton({
    className,
    variant,
    size,
    children,
    glitchEffect = false,
    onClick,
    disabled,
    type = "button"
}: HackerButtonProps) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.button
            className={cn(hackerButtonVariants({ variant, size }), className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            disabled={disabled}
            type={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Scanning line effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ff41]/30 to-transparent"
                initial={{ x: "-100%" }}
                animate={isHovered ? { x: "100%" } : { x: "-100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            />

            {/* Matrix rain effect for matrix variant */}
            {variant === "matrix" && (
                <div className="absolute inset-0 opacity-20">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-px h-full bg-[#00ff41]"
                            style={{ left: `${20 * i}%` }}
                            animate={{
                                opacity: [0, 1, 0],
                                height: ["0%", "100%", "0%"]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Glitch effect */}
            {glitchEffect && isHovered && (
                <>
                    <motion.span
                        className="absolute inset-0 flex items-center justify-center text-red-400"
                        animate={{
                            x: [0, -2, 2, 0],
                            opacity: [0, 1, 0]
                        }}
                        transition={{ duration: 0.2, repeat: 3 }}
                    >
                        {children}
                    </motion.span>
                    <motion.span
                        className="absolute inset-0 flex items-center justify-center text-blue-400"
                        animate={{
                            x: [0, 2, -2, 0],
                            opacity: [0, 1, 0]
                        }}
                        transition={{ duration: 0.2, repeat: 3, delay: 0.1 }}
                    >
                        {children}
                    </motion.span>
                </>
            )}

            {/* Main content */}
            <span className="relative z-10">{children}</span>
        </motion.button>
    )
}