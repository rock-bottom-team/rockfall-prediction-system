"use client"

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"

interface PredictionChartProps {
  riskProbability: number
  timeHorizon: string
}

export function PredictionChart({ riskProbability, timeHorizon }: PredictionChartProps) {
  // Generate prediction data based on current risk and time horizon
  const generatePredictionData = () => {
    const hours =
      timeHorizon === "6h"
        ? 6
        : timeHorizon === "12h"
          ? 12
          : timeHorizon === "24h"
            ? 24
            : timeHorizon === "48h"
              ? 48
              : 168
    const points = Math.min(hours, 24) // Max 24 data points

    const data = []
    for (let i = 0; i <= points; i++) {
      const timePoint = (i / points) * hours

      // Simulate risk evolution - generally increasing with some randomness
      const baseRisk = riskProbability
      const timeMultiplier = 1 + (timePoint / hours) * 0.3 // Risk increases over time
      const randomVariation = (Math.random() - 0.5) * 10 // ±5% random variation

      const risk = Math.max(0, Math.min(100, baseRisk * timeMultiplier + randomVariation))

      data.push({
        time: timePoint < 1 ? `${Math.round(timePoint * 60)}m` : `${Math.round(timePoint)}h`,
        risk: Math.round(risk * 10) / 10,
        confidence: Math.max(60, 95 - (timePoint / hours) * 20), // Confidence decreases over time
      })
    }

    return data
  }

  const data = generatePredictionData()

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return "#ef4444" // red
    if (risk >= 60) return "#f97316" // orange
    if (risk >= 40) return "#eab308" // yellow
    return "#22c55e" // green
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={getRiskColor(riskProbability)} stopOpacity={0.3} />
              <stop offset="95%" stopColor={getRiskColor(riskProbability)} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            label={{ value: "Risk (%)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value, name) => [
              name === "risk" ? `${value}%` : `${value}%`,
              name === "risk" ? "Risk Probability" : "Confidence",
            ]}
          />
          <Area
            type="monotone"
            dataKey="risk"
            stroke={getRiskColor(riskProbability)}
            strokeWidth={2}
            fill="url(#riskGradient)"
          />
          <Line
            type="monotone"
            dataKey="confidence"
            stroke="#6b7280"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: getRiskColor(riskProbability) }}></div>
          <span>Risk Probability</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-gray-500" style={{ borderStyle: "dashed" }}></div>
          <span>Confidence Level</span>
        </div>
      </div>
    </div>
  )
}
