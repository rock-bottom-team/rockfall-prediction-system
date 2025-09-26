"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Droplets, Activity, Gauge } from "lucide-react"

interface SensorData {
  rainfall: number
  vibration: number
  pressure: number
}

export function LiveSensorGauges() {
  const [sensorData, setSensorData] = useState<SensorData>({
    rainfall: 45,
    vibration: 25,
    pressure: 60,
  })

  useEffect(() => {
    // Simulate real-time sensor updates
    const interval = setInterval(() => {
      setSensorData({
        rainfall: Math.floor(Math.random() * 100),
        vibration: Math.floor(Math.random() * 100),
        pressure: Math.floor(Math.random() * 100),
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getSensorStatus = (value: number) => {
    if (value < 40) return { color: "bg-green-500", status: "Normal" }
    if (value < 70) return { color: "bg-yellow-500", status: "Warning" }
    return { color: "bg-red-500", status: "Critical" }
  }

  const sensors = [
    {
      name: "Rainfall",
      value: sensorData.rainfall,
      unit: "mm",
      icon: Droplets,
      ...getSensorStatus(sensorData.rainfall),
    },
    {
      name: "Vibration",
      value: sensorData.vibration,
      unit: "Hz",
      icon: Activity,
      ...getSensorStatus(sensorData.vibration),
    },
    {
      name: "Pressure",
      value: sensorData.pressure,
      unit: "kPa",
      icon: Gauge,
      ...getSensorStatus(sensorData.pressure),
    },
  ]

  return (
    <div className="space-y-4">
      {sensors.map((sensor) => (
        <Card key={sensor.name} className="p-3">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <sensor.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{sensor.name}</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">
                  {sensor.value}
                  <span className="text-sm text-muted-foreground ml-1">{sensor.unit}</span>
                </div>
                <div className={`text-xs ${sensor.color.replace("bg-", "text-")}`}>{sensor.status}</div>
              </div>
            </div>
            <Progress value={sensor.value} className="h-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
