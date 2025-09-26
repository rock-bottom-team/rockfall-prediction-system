"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MineMap } from "@/components/mine-map"
import { RiskIndicator } from "@/components/risk-indicator"
import { ReportsPage } from "@/components/reports-page"
import { LogOut, Users, MapPin, AlertTriangle, FileText, Download, BarChart3 } from "lucide-react"
import { useState } from "react"

export function ManagerDashboard() {
  const { user, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState("overview")

  const sidebarItems = [
    { icon: BarChart3, label: "Overview", active: currentPage === "overview" },
    { icon: Users, label: "Workers", active: currentPage === "workers" },
    { icon: AlertTriangle, label: "Incidents", active: currentPage === "incidents" },
    { icon: FileText, label: "Reports", active: currentPage === "reports" },
  ]

  const handleNavigation = (label: string) => {
    setCurrentPage(label.toLowerCase())
  }

  const kpis = [
    { label: "Total Workers", value: "120", icon: Users },
    { label: "Active Zones", value: "5", icon: MapPin },
    { label: "Active Alerts", value: "3", icon: AlertTriangle },
  ]

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "reports":
        return <ReportsPage />
      case "overview":
      default:
        return (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {kpis.map((kpi) => (
                <Card key={kpi.label}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{kpi.label}</p>
                        <p className="text-3xl font-bold">{kpi.value}</p>
                      </div>
                      <kpi.icon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mine Overview */}
              <div className="lg:col-span-2">
                <Card className="h-[500px]">
                  <CardHeader>
                    <CardTitle>Mine Overview</CardTitle>
                    <CardDescription>Worker distribution and zone status</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-80px)]">
                    <MineMap />
                  </CardContent>
                </Card>
              </div>

              {/* Reports Panel */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Reports</CardTitle>
                    <CardDescription>Generate and export reports</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      className="w-full justify-start bg-transparent"
                      variant="outline"
                      onClick={() => setCurrentPage("reports")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Safety Report (PDF)
                    </Button>
                    <Button
                      className="w-full justify-start bg-transparent"
                      variant="outline"
                      onClick={() => setCurrentPage("reports")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Incident Log (CSV)
                    </Button>
                    <Button
                      className="w-full justify-start bg-transparent"
                      variant="outline"
                      onClick={() => setCurrentPage("reports")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Worker Distribution
                    </Button>
                  </CardContent>
                </Card>
              </div>
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
          <p className="text-sm text-sidebar-foreground/70">Management Portal</p>
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
              <h1 className="text-xl font-bold">Manager Dashboard</h1>
              <RiskIndicator risk="warning" />
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">{user?.name}</Badge>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">{renderCurrentPage()}</main>
      </div>
    </div>
  )
}
