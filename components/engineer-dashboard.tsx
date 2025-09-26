"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MineMap } from "@/components/mine-map"
import { LiveSensorGauges } from "@/components/live-sensor-gauges"
import { AlertsPanel } from "@/components/alerts-panel"
import { RiskIndicator } from "@/components/risk-indicator"
import { LiveSensorsPage } from "@/components/live-sensors-page"
import { AlertsPage } from "@/components/alerts-page"
import { SimulationPage } from "@/components/simulation-page"
import { LogOut, Bell, Activity, Map, BarChart3, FileText, Settings } from "lucide-react"

export function EngineerDashboard() {
  const { user, logout } = useAuth()
  const [globalRisk, setGlobalRisk] = useState<"safe" | "warning" | "danger">("safe")
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [currentPage, setCurrentPage] = useState("dashboard")

  useEffect(() => {
    // Simulate real-time risk updates
    const interval = setInterval(() => {
      const risks = ["safe", "warning", "danger"] as const
      const randomRisk = risks[Math.floor(Math.random() * risks.length)]
      setGlobalRisk(randomRisk)
      setLastUpdate(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const sidebarItems = [
    { icon: BarChart3, label: "Dashboard", active: currentPage === "dashboard" },
    { icon: Activity, label: "Live Sensors", active: currentPage === "livesensors" },
    { icon: Bell, label: "Alerts", active: currentPage === "alerts" },
    { icon: Map, label: "Simulation", active: currentPage === "simulation" },
    { icon: FileText, label: "Reports", active: currentPage === "reports" },
    { icon: Settings, label: "Settings", active: currentPage === "settings" },
  ]

  const handleNavigation = (label: string) => {
    setCurrentPage(label.toLowerCase().replace(" ", ""))
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "livesensors":
        return <LiveSensorsPage />
      case "alerts":
        return <AlertsPage />
      case "simulation":
        return <SimulationPage />
      case "dashboard":
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Mine Map - Takes up 2/3 of the space */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>3D Mine Map</CardTitle>
                  <CardDescription>Real-time zone monitoring with worker positions</CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-80px)]">
                  <MineMap />
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Sensors and Alerts */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Sensors</CardTitle>
                  <CardDescription>Real-time environmental monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <LiveSensorGauges />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>Latest 3 system alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertsPanel compact />
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Mine Safety</h2>
          <p className="text-sm text-sidebar-foreground/70">Monitoring System</p>
        </div>

        <nav className="px-4 space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${
                item.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
              onClick={() => handleNavigation(item.label)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">Engineer Dashboard</h1>
              <RiskIndicator risk={globalRisk} />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">Last Update: {lastUpdate.toLocaleTimeString()}</div>
              <Badge variant="outline">{user?.name}</Badge>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{renderCurrentPage()}</main>
      </div>
    </div>
  )
}
