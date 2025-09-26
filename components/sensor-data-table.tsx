"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

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

interface SensorDataTableProps {
  data: SensorReading[]
}

export function SensorDataTable({ data }: SensorDataTableProps) {
  const getValueStatus = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "destructive"
    if (value >= thresholds.warning) return "secondary"
    return "default"
  }

  const thresholds = {
    rainfall: { warning: 60, critical: 80 },
    vibration: { warning: 50, critical: 75 },
    pressure: { warning: 70, critical: 85 },
    temperature: { warning: 35, critical: 40 },
    humidity: { warning: 80, critical: 90 },
    seismic: { warning: 60, critical: 80 },
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead>Rainfall (mm)</TableHead>
            <TableHead>Vibration (Hz)</TableHead>
            <TableHead>Pressure (kPa)</TableHead>
            <TableHead>Temp (°C)</TableHead>
            <TableHead>Humidity (%)</TableHead>
            <TableHead>Seismic (mg)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((reading) => (
            <TableRow key={reading.id}>
              <TableCell className="font-mono text-sm">{reading.timestamp.toLocaleTimeString()}</TableCell>
              <TableCell>
                <Badge variant="outline">{reading.zone}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getValueStatus(reading.rainfall, thresholds.rainfall) as any}>{reading.rainfall}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getValueStatus(reading.vibration, thresholds.vibration) as any}>
                  {reading.vibration}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getValueStatus(reading.pressure, thresholds.pressure) as any}>{reading.pressure}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getValueStatus(reading.temperature, thresholds.temperature) as any}>
                  {reading.temperature}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getValueStatus(reading.humidity, thresholds.humidity) as any}>{reading.humidity}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getValueStatus(reading.seismic, thresholds.seismic) as any}>{reading.seismic}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
