"use client"

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart } from "recharts"

interface IncidentTrendChartProps {
  data: { date: string; incidents: number; severity: string }[]
}

export function IncidentTrendChart({ data }: IncidentTrendChartProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "#ef4444"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  const chartData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    fill: getSeverityColor(item.severity),
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value, name) => [`${value} incidents`, "Count"]}
          />
          <Bar dataKey="incidents" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
