"use client"

import type React from "react"
import { Button as ShadcnButton } from "@/components/ui/button"

interface CustomButtonProps extends React.ComponentProps<typeof ShadcnButton> {
  variant?: "primary" | "secondary" | "ghost" | "success" | "danger" | "default" | "outline" | "destructive" | "link"
}

export const Button: React.FC<CustomButtonProps> = ({ variant = "default", className = "", ...props }) => {
  // Map custom variants to shadcn variants
  const variantMap: Record<string, string> = {
    primary: "default",
    success: "default",
    danger: "destructive",
    ghost: "ghost",
    secondary: "secondary",
  }

  const mappedVariant = variantMap[variant as string] || variant

  return <ShadcnButton variant={mappedVariant as any} className={className} {...props} />
}
