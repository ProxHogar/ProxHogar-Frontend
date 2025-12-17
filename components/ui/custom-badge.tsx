"use client"

import type React from "react"
import { Badge as ShadcnBadge } from "@/components/ui/badge"

interface CustomBadgeProps {
  status: string
}

export const Badge: React.FC<CustomBadgeProps> = ({ status }) => {
  const styles: Record<string, string> = {
    PENDIENTE: "bg-orange-100 text-orange-700 border-orange-200",
    OFERTANDO: "bg-blue-100 text-blue-700 border-blue-200",
    EN_PROCESO: "bg-purple-100 text-purple-700 border-purple-200",
    FINALIZADA: "bg-emerald-100 text-emerald-700 border-emerald-200",
    CANCELADA: "bg-gray-100 text-gray-500 border-gray-200",
  }

  const className = styles[status] || "bg-gray-100"

  return (
    <ShadcnBadge variant="outline" className={className}>
      {status}
    </ShadcnBadge>
  )
}
