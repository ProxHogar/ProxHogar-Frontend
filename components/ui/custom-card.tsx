"use client"

import type React from "react"
import { Card as ShadcnCard } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CustomCardProps extends React.ComponentProps<"div"> {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CustomCardProps> = ({ children, className = "", ...props }) => (
  <ShadcnCard
    className={cn(
      "bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-300",
      className,
    )}
    {...props}
  >
    {children}
  </ShadcnCard>
)
