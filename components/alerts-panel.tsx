"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react"

interface Alert {
  id: string
  type: "critical" | "warning" | "info"
  zone: string
  message: string
  timestamp: Date
  acknowledged: boolean
}

interface AlertsPanelProps {
  compact?: boolean
}

export function AlertsPanel({ compact = false }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "critical",
      zone: "Zone B",
      message: "Rockfall risk 82% in 2h",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      acknowledged: false,
    },
    {
      id: "2",
      type: "warning",
      zone: "Zone C",
      message: "Rainfall crossing 60mm threshold",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      acknowledged: false,
    },
    {
      id: "3",
      type: "info",
      zone: "Zone A",
      message: "Maintenance scheduled for 14:00",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      acknowledged: true,
    },
  ])

  useEffect(() => {
    // Simulate new alerts
    const interval = setInterval(() => {
      const zones = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"]
      const types = ["critical", "warning", "info"] as const
      const messages = [
        "High vibration detected",
        "Pressure anomaly detected",
        "Worker evacuation recommended",
        "Sensor maintenance required",
        "Weather alert issued",
      ]

      const newAlert: Alert = {
        id: Date.now().toString(),
        type: types[Math.floor(Math.random() * types.length)],
        zone: zones[Math.floor(Math.random() * zones.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        timestamp: new Date(),
        acknowledged: false,
      }

      setAlerts((prev) => [newAlert, ...prev.slice(0, compact ? 2 : 9)])
    }, 45000)

    return () => clearInterval(interval)
  }, [compact])

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert)))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return AlertCircle
      case "warning":
        return AlertTriangle
      case "info":
        return Info
      default:
        return Info
    }
  }

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "critical":
        return "destructive"
      case "warning":
        return "secondary"
      case "info":
        return "outline"
      default:
        return "outline"
    }
  }

  const displayAlerts = compact ? alerts.slice(0, 3) : alerts

  return (
    <div className="space-y-3">
      {displayAlerts.map((alert) => {
        const Icon = getAlertIcon(alert.type)
        return (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border ${alert.acknowledged ? "opacity-60" : ""} ${
              alert.type === "critical" ? "border-red-500 bg-red-500/10" : "border-border"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1">
                <Icon className={`h-4 w-4 mt-0.5 ${alert.type === "critical" ? "text-red-500" : "text-yellow-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getAlertVariant(alert.type) as any} className="text-xs">
                      {alert.type.toUpperCase()}
                    </Badge>
                    <span className="text-sm font-medium">{alert.zone}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
              {!alert.acknowledged && (
                <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                  <CheckCircle className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
