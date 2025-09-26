"use client"

import { Progress } from "@/components/ui/progress"

interface SensorGaugeProps {
  value: number
  max: number
  unit: string
  color: string
  threshold: {
    warning: number
    critical: number
  }
}

export function SensorGauge({ value, max, unit, color, threshold }: SensorGaugeProps) {
  const percentage = (value / max) * 100

  const getStatusColor = () => {
    if (value >= threshold.critical) return "text-red-500"
    if (value >= threshold.warning) return "text-yellow-500"
    return "text-green-500"
  }

  const getStatus = () => {
    if (value >= threshold.critical) return "CRITICAL"
    if (value >= threshold.warning) return "WARNING"
    return "NORMAL"
  }

  return (
    <div className="space-y-4">
      {/* Circular Gauge Visualization */}
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 2.51} 251`}
            className={getStatusColor()}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground">{unit}</div>
        </div>
      </div>

      {/* Status and Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          <span className={`text-sm font-bold ${getStatusColor()}`}>{getStatus()}</span>
        </div>
        <Progress value={percentage} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span className="text-yellow-500">⚠ {threshold.warning}</span>
          <span className="text-red-500">🚨 {threshold.critical}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  )
}
