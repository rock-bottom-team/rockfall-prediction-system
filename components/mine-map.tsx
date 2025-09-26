"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MineZone {
  id: string
  name: string
  risk: "safe" | "warning" | "danger"
  workers: number
  x: number
  y: number
}

export function MineMap() {
  const [zones, setZones] = useState<MineZone[]>([
    { id: "A", name: "Zone A", risk: "safe", workers: 12, x: 20, y: 30 },
    { id: "B", name: "Zone B", risk: "warning", workers: 8, x: 60, y: 20 },
    { id: "C", name: "Zone C", risk: "safe", workers: 15, x: 40, y: 60 },
    { id: "D", name: "Zone D", risk: "danger", workers: 3, x: 80, y: 70 },
    { id: "E", name: "Zone E", risk: "safe", workers: 10, x: 15, y: 80 },
  ])

  const [selectedZone, setSelectedZone] = useState<MineZone | null>(null)

  useEffect(() => {
    // Simulate real-time zone updates
    const interval = setInterval(() => {
      setZones((prevZones) =>
        prevZones.map((zone) => ({
          ...zone,
          risk: Math.random() > 0.7 ? (Math.random() > 0.5 ? "warning" : "danger") : "safe",
          workers: Math.floor(Math.random() * 20) + 1,
        })),
      )
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "safe":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "danger":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "safe":
        return "default"
      case "warning":
        return "secondary"
      case "danger":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden">
      {/* Mine Layout Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
        {/* Simulated mine tunnels */}
        <svg className="w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Mine Zones */}
      {zones.map((zone) => (
        <div
          key={zone.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
          onClick={() => setSelectedZone(zone)}
        >
          <div
            className={`w-16 h-16 rounded-full ${getRiskColor(zone.risk)} opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-lg shadow-lg`}
          >
            {zone.id}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-white text-center">
            <div className="font-semibold">{zone.name}</div>
            <div className="text-gray-300">{zone.workers} workers</div>
          </div>
        </div>
      ))}

      {/* Zone Details Tooltip */}
      {selectedZone && (
        <Card className="absolute top-4 right-4 p-4 min-w-[200px]">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{selectedZone.name}</h3>
              <Badge variant={getRiskBadgeVariant(selectedZone.risk)}>{selectedZone.risk.toUpperCase()}</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              <div>Workers: {selectedZone.workers}</div>
              <div>Status: Active monitoring</div>
              <div>Last update: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </Card>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3">
        <h4 className="text-sm font-semibold mb-2">Risk Levels</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Safe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Danger</span>
          </div>
        </div>
      </div>
    </div>
  )
}
