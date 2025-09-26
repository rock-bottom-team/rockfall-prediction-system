"use client"

import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, AlertCircle } from "lucide-react"

interface RiskIndicatorProps {
  risk: "safe" | "warning" | "danger"
}

export function RiskIndicator({ risk }: RiskIndicatorProps) {
  const getRiskConfig = (risk: string) => {
    switch (risk) {
      case "safe":
        return {
          icon: Shield,
          label: "SAFE",
          variant: "default" as const,
          className: "bg-green-500 text-white hover:bg-green-600",
        }
      case "warning":
        return {
          icon: AlertTriangle,
          label: "WARNING",
          variant: "secondary" as const,
          className: "bg-yellow-500 text-black hover:bg-yellow-600",
        }
      case "danger":
        return {
          icon: AlertCircle,
          label: "DANGER",
          variant: "destructive" as const,
          className: "bg-red-500 text-white hover:bg-red-600",
        }
      default:
        return {
          icon: Shield,
          label: "UNKNOWN",
          variant: "outline" as const,
          className: "",
        }
    }
  }

  const config = getRiskConfig(risk)
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`flex items-center gap-2 px-3 py-1 ${config.className}`}>
      <Icon className="h-4 w-4" />
      Global Risk: {config.label}
    </Badge>
  )
}
