"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SensorGauge } from "@/components/sensor-gauge"
import { SensorChart } from "@/components/sensor-chart"
import { SensorDataTable } from "@/components/sensor-data-table"
import { Droplets, Activity, Gauge, Thermometer, Wind, Zap, Download } from "lucide-react"

interface SensorReading {
  id: string
  timestamp: Date
  zone: string
  rainfall: number
  vibration: number
  pressure: number
  temperature: number
  humidity: number
  seismic: number
}

export function LiveSensorsPage() {
  const [sensorData, setSensorData] = useState<SensorReading[]>([])
  const [selectedZone, setSelectedZone] = useState<string>("all")
  const [selectedSensor, setSelectedSensor] = useState<string>("all")

  useEffect(() => {
    // Initialize with some historical data
    const initialData: SensorReading[] = []
    const zones = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"]

    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(Date.now() - i * 2 * 60 * 1000) // Every 2 minutes
      zones.forEach((zone) => {
        initialData.push({
          id: `${zone}-${timestamp.getTime()}`,
          timestamp,
          zone,
          rainfall: Math.floor(Math.random() * 100),
          vibration: Math.floor(Math.random() * 100),
          pressure: Math.floor(Math.random() * 100),
          temperature: Math.floor(Math.random() * 40) + 10,
          humidity: Math.floor(Math.random() * 100),
          seismic: Math.floor(Math.random() * 100),
        })
      })
    }

    setSensorData(initialData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()))

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newReadings: SensorReading[] = zones.map((zone) => ({
        id: `${zone}-${Date.now()}`,
        timestamp: new Date(),
        zone,
        rainfall: Math.floor(Math.random() * 100),
        vibration: Math.floor(Math.random() * 100),
        pressure: Math.floor(Math.random() * 100),
        temperature: Math.floor(Math.random() * 40) + 10,
        humidity: Math.floor(Math.random() * 100),
        seismic: Math.floor(Math.random() * 100),
      }))

      setSensorData((prev) => [...newReadings, ...prev].slice(0, 500)) // Keep last 500 readings
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const latestReading = sensorData[0] || {
    rainfall: 0,
    vibration: 0,
    pressure: 0,
    temperature: 0,
    humidity: 0,
    seismic: 0,
  }

  const sensors = [
    {
      name: "Rainfall",
      value: latestReading.rainfall,
      unit: "mm",
      icon: Droplets,
      color: "blue",
      threshold: { warning: 60, critical: 80 },
    },
    {
      name: "Vibration",
      value: latestReading.vibration,
      unit: "Hz",
      icon: Activity,
      color: "green",
      threshold: { warning: 50, critical: 75 },
    },
    {
      name: "Pressure",
      value: latestReading.pressure,
      unit: "kPa",
      icon: Gauge,
      color: "purple",
      threshold: { warning: 70, critical: 85 },
    },
    {
      name: "Temperature",
      value: latestReading.temperature,
      unit: "°C",
      icon: Thermometer,
      color: "red",
      threshold: { warning: 35, critical: 40 },
    },
    {
      name: "Humidity",
      value: latestReading.humidity,
      unit: "%",
      icon: Wind,
      color: "cyan",
      threshold: { warning: 80, critical: 90 },
    },
    {
      name: "Seismic",
      value: latestReading.seismic,
      unit: "mg",
      icon: Zap,
      color: "orange",
      threshold: { warning: 60, critical: 80 },
    },
  ]

  const filteredData = sensorData.filter((reading) => {
    if (selectedZone !== "all" && reading.zone !== selectedZone) return false
    return true
  })

  const exportData = () => {
    const csv = [
      ["Timestamp", "Zone", "Rainfall", "Vibration", "Pressure", "Temperature", "Humidity", "Seismic"],
      ...filteredData
        .slice(0, 100)
        .map((reading) => [
          reading.timestamp.toISOString(),
          reading.zone,
          reading.rainfall,
          reading.vibration,
          reading.pressure,
          reading.temperature,
          reading.humidity,
          reading.seismic,
        ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sensor-data-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Live Sensor Monitoring</h1>
          <p className="text-muted-foreground">Real-time environmental data from all mine zones</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              <SelectItem value="Zone A">Zone A</SelectItem>
              <SelectItem value="Zone B">Zone B</SelectItem>
              <SelectItem value="Zone C">Zone C</SelectItem>
              <SelectItem value="Zone D">Zone D</SelectItem>
              <SelectItem value="Zone E">Zone E</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Sensor Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sensors.map((sensor) => (
          <Card key={sensor.name}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <sensor.icon className="h-5 w-5" />
                {sensor.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SensorGauge
                value={sensor.value}
                max={sensor.name === "Temperature" ? 50 : 100}
                unit={sensor.unit}
                color={sensor.color}
                threshold={sensor.threshold}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Views */}
      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">Historical Charts</TabsTrigger>
          <TabsTrigger value="table">Data Table</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sensors.slice(0, 4).map((sensor) => (
              <Card key={sensor.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <sensor.icon className="h-4 w-4" />
                    {sensor.name} Trend
                  </CardTitle>
                  <CardDescription>Last 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <SensorChart
                    data={filteredData.slice(0, 50)}
                    dataKey={sensor.name.toLowerCase()}
                    color={sensor.color}
                    unit={sensor.unit}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Sensor Data Feed</CardTitle>
              <CardDescription>Latest sensor readings from all zones</CardDescription>
            </CardHeader>
            <CardContent>
              <SensorDataTable data={filteredData.slice(0, 20)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Analysis</CardTitle>
                <CardDescription>Current risk assessment based on sensor data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sensors.map((sensor) => {
                  const status =
                    sensor.value >= sensor.threshold.critical
                      ? "critical"
                      : sensor.value >= sensor.threshold.warning
                        ? "warning"
                        : "normal"

                  return (
                    <div key={sensor.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <sensor.icon className="h-4 w-4" />
                        <span>{sensor.name}</span>
                      </div>
                      <Badge
                        variant={status === "critical" ? "destructive" : status === "warning" ? "secondary" : "default"}
                      >
                        {status.toUpperCase()}
                      </Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zone Status</CardTitle>
                <CardDescription>Risk level by mine zone</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"].map((zone) => {
                  const zoneData = sensorData.filter((d) => d.zone === zone).slice(0, 1)[0]
                  if (!zoneData) return null

                  const avgRisk = (zoneData.rainfall + zoneData.vibration + zoneData.pressure + zoneData.seismic) / 4
                  const status = avgRisk >= 70 ? "danger" : avgRisk >= 50 ? "warning" : "safe"

                  return (
                    <div key={zone} className="flex items-center justify-between">
                      <span>{zone}</span>
                      <Badge
                        variant={status === "danger" ? "destructive" : status === "warning" ? "secondary" : "default"}
                      >
                        {status.toUpperCase()}
                      </Badge>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
