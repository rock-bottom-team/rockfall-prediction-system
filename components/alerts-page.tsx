"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { AlertCircle, AlertTriangle, Info, CheckCircle, Clock, User, MapPin, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Alert {
  id: string
  type: "critical" | "warning" | "info"
  zone: string
  title: string
  message: string
  timestamp: Date
  acknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: Date
  actionTaken?: string
  resolved: boolean
  resolvedAt?: Date
  priority: "high" | "medium" | "low"
  category: "safety" | "equipment" | "environmental" | "maintenance"
}

interface IncidentLog {
  id: string
  alertId: string
  timestamp: Date
  action: string
  user: string
  notes: string
}

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [incidentLogs, setIncidentLogs] = useState<IncidentLog[]>([])
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [actionNotes, setActionNotes] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Initialize with sample alerts
    const initialAlerts: Alert[] = [
      {
        id: "1",
        type: "critical",
        zone: "Zone B",
        title: "High Rockfall Risk",
        message: "Rockfall probability 82% within 2 hours. Immediate evacuation recommended.",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        acknowledged: false,
        resolved: false,
        priority: "high",
        category: "safety",
      },
      {
        id: "2",
        type: "warning",
        zone: "Zone C",
        title: "Rainfall Threshold Exceeded",
        message: "Rainfall has crossed 60mm threshold. Monitor conditions closely.",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        acknowledged: true,
        acknowledgedBy: "John Smith",
        acknowledgedAt: new Date(Date.now() - 10 * 60 * 1000),
        resolved: false,
        priority: "medium",
        category: "environmental",
      },
      {
        id: "3",
        type: "info",
        zone: "Zone A",
        title: "Scheduled Maintenance",
        message: "Routine sensor maintenance scheduled for 14:00 today.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        acknowledged: true,
        acknowledgedBy: "Sarah Johnson",
        acknowledgedAt: new Date(Date.now() - 25 * 60 * 1000),
        resolved: true,
        resolvedAt: new Date(Date.now() - 20 * 60 * 1000),
        priority: "low",
        category: "maintenance",
      },
      {
        id: "4",
        type: "warning",
        zone: "Zone D",
        title: "Equipment Malfunction",
        message: "Vibration sensor showing irregular readings. Requires inspection.",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        acknowledged: false,
        resolved: false,
        priority: "medium",
        category: "equipment",
      },
    ]

    setAlerts(initialAlerts)

    // Simulate new alerts
    const interval = setInterval(() => {
      const zones = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"]
      const types = ["critical", "warning", "info"] as const
      const categories = ["safety", "equipment", "environmental", "maintenance"] as const
      const titles = [
        "High Vibration Detected",
        "Pressure Anomaly",
        "Worker Safety Alert",
        "Sensor Calibration Required",
        "Weather Warning",
        "Equipment Status Change",
      ]

      const newAlert: Alert = {
        id: Date.now().toString(),
        type: types[Math.floor(Math.random() * types.length)],
        zone: zones[Math.floor(Math.random() * zones.length)],
        title: titles[Math.floor(Math.random() * titles.length)],
        message: "Automated alert generated from sensor data analysis.",
        timestamp: new Date(),
        acknowledged: false,
        resolved: false,
        priority: Math.random() > 0.5 ? "high" : "medium",
        category: categories[Math.floor(Math.random() * categories.length)],
      }

      setAlerts((prev) => [newAlert, ...prev])

      // Show toast for critical alerts
      if (newAlert.type === "critical") {
        toast({
          title: "🚨 CRITICAL ALERT",
          description: `${newAlert.zone}: ${newAlert.title}`,
          variant: "destructive",
        })
      }
    }, 60000) // New alert every minute

    return () => clearInterval(interval)
  }, [toast])

  const acknowledgeAlert = (alert: Alert) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alert.id
          ? {
              ...a,
              acknowledged: true,
              acknowledgedBy: "Current User",
              acknowledgedAt: new Date(),
            }
          : a,
      ),
    )

    // Add to incident log
    const logEntry: IncidentLog = {
      id: Date.now().toString(),
      alertId: alert.id,
      timestamp: new Date(),
      action: "Alert Acknowledged",
      user: "Current User",
      notes: "Alert acknowledged by operator",
    }

    setIncidentLogs((prev) => [logEntry, ...prev])
    setSelectedAlert(null)

    toast({
      title: "Alert Acknowledged",
      description: `${alert.zone}: ${alert.title}`,
    })
  }

  const resolveAlert = (alert: Alert) => {
    if (!actionNotes.trim()) {
      toast({
        title: "Action Required",
        description: "Please provide details of the action taken.",
        variant: "destructive",
      })
      return
    }

    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alert.id
          ? {
              ...a,
              resolved: true,
              resolvedAt: new Date(),
              actionTaken: actionNotes,
            }
          : a,
      ),
    )

    // Add to incident log
    const logEntry: IncidentLog = {
      id: Date.now().toString(),
      alertId: alert.id,
      timestamp: new Date(),
      action: "Alert Resolved",
      user: "Current User",
      notes: actionNotes,
    }

    setIncidentLogs((prev) => [logEntry, ...prev])
    setSelectedAlert(null)
    setActionNotes("")

    toast({
      title: "Alert Resolved",
      description: `${alert.zone}: ${alert.title}`,
    })
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return AlertCircle
      case "warning":
        return AlertTriangle
      case "info":
        return Info
      default:
        return Info
    }
  }

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "critical":
        return "destructive"
      case "warning":
        return "secondary"
      case "info":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    if (filterType !== "all" && alert.type !== filterType) return false
    if (filterStatus === "active" && (alert.acknowledged || alert.resolved)) return false
    if (filterStatus === "acknowledged" && !alert.acknowledged) return false
    if (filterStatus === "resolved" && !alert.resolved) return false
    return true
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alert & Incident Management</h1>
          <p className="text-muted-foreground">Monitor and manage safety alerts across all mine zones</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold">{alerts.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-red-500">
                  {alerts.filter((a) => !a.acknowledged && !a.resolved).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Acknowledged</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {alerts.filter((a) => a.acknowledged && !a.resolved).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-500">{alerts.filter((a) => a.resolved).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="history">Alert History</TabsTrigger>
          <TabsTrigger value="incidents">Incident Log</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {filteredAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.type)
            return (
              <Card
                key={alert.id}
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  alert.type === "critical" && !alert.acknowledged ? "border-red-500 bg-red-500/5" : ""
                }`}
                onClick={() => setSelectedAlert(alert)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Icon
                        className={`h-6 w-6 mt-1 ${
                          alert.type === "critical"
                            ? "text-red-500"
                            : alert.type === "warning"
                              ? "text-yellow-500"
                              : "text-blue-500"
                        }`}
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={getAlertVariant(alert.type) as any}>{alert.type.toUpperCase()}</Badge>
                          <Badge variant="outline">{alert.zone}</Badge>
                          <Badge variant="outline" className={getPriorityColor(alert.priority)}>
                            {alert.priority.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{alert.category}</span>
                        </div>
                        <h3 className="font-semibold text-lg">{alert.title}</h3>
                        <p className="text-muted-foreground">{alert.message}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{alert.timestamp.toLocaleString()}</span>
                          {alert.acknowledged && (
                            <span className="text-yellow-500">
                              Acknowledged by {alert.acknowledgedBy} at {alert.acknowledgedAt?.toLocaleTimeString()}
                            </span>
                          )}
                          {alert.resolved && (
                            <span className="text-green-500">Resolved at {alert.resolvedAt?.toLocaleTimeString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.resolved && <CheckCircle className="h-5 w-5 text-green-500" />}
                      {alert.acknowledged && !alert.resolved && <Clock className="h-5 w-5 text-yellow-500" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>Complete history of all alerts and their resolution status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts
                  .filter((a) => a.resolved)
                  .map((alert) => {
                    const Icon = getAlertIcon(alert.type)
                    return (
                      <div key={alert.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{alert.title}</span>
                            <Badge variant="outline">{alert.zone}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          {alert.actionTaken && (
                            <p className="text-sm text-green-600 mt-1">Action: {alert.actionTaken}</p>
                          )}
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>Resolved: {alert.resolvedAt?.toLocaleString()}</div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle>Incident Log</CardTitle>
              <CardDescription>Detailed log of all actions taken on alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{log.action}</span>
                        <Badge variant="outline">Alert #{log.alertId}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{log.notes}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {log.user}
                        </span>
                        <span>{log.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alert Detail Modal */}
      <AlertDialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {selectedAlert && (
                <>
                  {(() => {
                    const Icon = getAlertIcon(selectedAlert.type)
                    return (
                      <Icon
                        className={`h-6 w-6 ${
                          selectedAlert.type === "critical"
                            ? "text-red-500"
                            : selectedAlert.type === "warning"
                              ? "text-yellow-500"
                              : "text-blue-500"
                        }`}
                      />
                    )
                  })()}
                  {selectedAlert.title}
                </>
              )}
            </AlertDialogTitle>
          </AlertDialogHeader>
          {selectedAlert && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Zone</label>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {selectedAlert.zone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Priority</label>
                  <p className={getPriorityColor(selectedAlert.priority)}>{selectedAlert.priority.toUpperCase()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p>{selectedAlert.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                  <p>{selectedAlert.timestamp.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1">{selectedAlert.message}</p>
              </div>

              {selectedAlert.acknowledged && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
                  <p className="text-sm">
                    <strong>Acknowledged by:</strong> {selectedAlert.acknowledgedBy} at{" "}
                    {selectedAlert.acknowledgedAt?.toLocaleString()}
                  </p>
                </div>
              )}

              {selectedAlert.resolved && selectedAlert.actionTaken && (
                <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg">
                  <p className="text-sm">
                    <strong>Resolution:</strong> {selectedAlert.actionTaken}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Resolved at {selectedAlert.resolvedAt?.toLocaleString()}
                  </p>
                </div>
              )}

              {!selectedAlert.resolved && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Action Taken</label>
                    <Textarea
                      placeholder="Describe the action taken to address this alert..."
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-2">
                    {!selectedAlert.acknowledged && (
                      <Button onClick={() => acknowledgeAlert(selectedAlert)} variant="outline">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Acknowledge
                      </Button>
                    )}
                    <Button onClick={() => resolveAlert(selectedAlert)} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resolve Alert
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
