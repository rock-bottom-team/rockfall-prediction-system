"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface WorkerDistributionChartProps {
  data: { zone: string; count: number; status: string }[]
}

export function WorkerDistributionChart({ data }: WorkerDistributionChartProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "#10b981"
      case "caution":
        return "#f59e0b"
      case "danger":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const chartData = data.map((item) => ({
    ...item,
    fill: getStatusColor(item.status),
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ zone, count }) => `${zone}: ${count}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} workers`, "Count"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
