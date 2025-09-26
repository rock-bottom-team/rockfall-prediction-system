"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SensorChartProps {
  data: any[]
  dataKey: string
  color: string
  unit: string
}

export function SensorChart({ data, dataKey, color, unit }: SensorChartProps) {
  const chartData = data
    .slice(0, 20)
    .reverse()
    .map((item) => ({
      time: item.timestamp.toLocaleTimeString(),
      value: item[dataKey],
    }))

  const getStrokeColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "#3b82f6",
      green: "#10b981",
      purple: "#8b5cf6",
      red: "#ef4444",
      cyan: "#06b6d4",
      orange: "#f97316",
    }
    return colors[color] || "#3b82f6"
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value) => [`${value} ${unit}`, dataKey]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={getStrokeColor(color)}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: getStrokeColor(color) }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
