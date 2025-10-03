'use client'

import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 terminal-text",
  {
    variants: {
      variant: {
        default: "border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41] glow-text",
        secondary: "border-gray-600 bg-gray-800/50 text-gray-300",
        destructive: "border-red-500 bg-red-500/10 text-red-400",
        outline: "border-[#00ff41] text-[#00ff41]",
        success: "border-green-400 bg-green-400/10 text-green-400",
        warning: "border-yellow-400 bg-yellow-400/10 text-yellow-400",
        info: "border-blue-400 bg-blue-400/10 text-blue-400",
      },
      size: {
        default: "px-2.5 py-0.5",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }