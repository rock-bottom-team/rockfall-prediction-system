"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Shield, RefreshCw, Wifi, WifiOff, LogOut, Volume2, VolumeX, MapPin, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WorkerStatus {
  status: "safe" | "caution" | "danger"
  zone: string
  lastUpdate: Date
  batteryLevel: number
  gpsCoordinates: { lat: number; lng: number }
}

interface EmergencyContact {
  name: string
  role: string
  phone: string
}

export function WorkerDashboard() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [workerStatus, setWorkerStatus] = useState<WorkerStatus>({
    status: "safe",
    zone: "Zone A",
    lastUpdate: new Date(),
    batteryLevel: 85,
    gpsCoordinates: { lat: -26.2041, lng: 28.0473 },
  })
  const [isOnline, setIsOnline] = useState(true)
  const [voiceAlertsEnabled, setVoiceAlertsEnabled] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  const emergencyContacts: EmergencyContact[] = [
    { name: "Control Room", role: "Emergency", phone: "+27-11-123-4567" },
    { name: "Site Manager", role: "Manager", phone: "+27-11-123-4568" },
    { name: "Safety Officer", role: "Safety", phone: "+27-11-123-4569" },
  ]

  useEffect(() => {
    // Check if app is installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    setIsInstalled(isStandalone)

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Simulate status updates
    const statusInterval = setInterval(() => {
      const statuses = ["safe", "caution", "danger"] as const
      const zones = ["Zone A", "Zone B", "Zone C", "Zone D", "Zone E"]
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
      const newZone = zones[Math.floor(Math.random() * zones.length)]

      setWorkerStatus((prev) => ({
        ...prev,
        status: newStatus,
        zone: newZone,
        lastUpdate: new Date(),
        batteryLevel: Math.max(10, prev.batteryLevel - Math.random() * 2),
      }))

      // Voice alert for danger status
      if (newStatus === "danger" && voiceAlertsEnabled) {
        speakAlert(`Danger alert in ${newZone}. Evacuate immediately.`)
      }
    }, 20000)

    // Simulate network status
    const networkInterval = setInterval(() => {
      setIsOnline(Math.random() > 0.1) // 90% chance of being online
    }, 30000)

    // Battery level updates
    const batteryInterval = setInterval(() => {
      setWorkerStatus((prev) => ({
        ...prev,
        batteryLevel: Math.max(5, prev.batteryLevel - 0.1),
      }))
    }, 60000)

    return () => {
      clearInterval(statusInterval)
      clearInterval(networkInterval)
      clearInterval(batteryInterval)
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [voiceAlertsEnabled])

  const speakAlert = (message: string) => {
    if ("speechSynthesis" in window && voiceAlertsEnabled) {
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 1
      speechSynthesis.speak(utterance)
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "safe":
        return {
          color: "bg-green-500",
          textColor: "text-green-500",
          borderColor: "border-green-500",
          icon: Shield,
          message: "All Clear - Continue Work",
          action: "Normal Operations",
          bgGradient: "from-green-500/20 to-green-600/10",
        }
      case "caution":
        return {
          color: "bg-yellow-500",
          textColor: "text-yellow-500",
          borderColor: "border-yellow-500",
          icon: AlertCircle,
          message: "Exercise Caution",
          action: "Monitor Conditions",
          bgGradient: "from-yellow-500/20 to-yellow-600/10",
        }
      case "danger":
        return {
          color: "bg-red-500",
          textColor: "text-red-500",
          borderColor: "border-red-500",
          icon: AlertCircle,
          message: "Evacuate Immediately",
          action: "Leave Area Now",
          bgGradient: "from-red-500/20 to-red-600/10",
        }
      default:
        return {
          color: "bg-gray-500",
          textColor: "text-gray-500",
          borderColor: "border-gray-500",
          icon: Shield,
          message: "Status Unknown",
          action: "Contact Supervisor",
          bgGradient: "from-gray-500/20 to-gray-600/10",
        }
    }
  }

  const config = getStatusConfig(workerStatus.status)
  const StatusIcon = config.icon

  const handleRefresh = () => {
    setWorkerStatus((prev) => ({ ...prev, lastUpdate: new Date() }))
    setIsOnline(Math.random() > 0.1)
    toast({
      title: "Status Updated",
      description: "Latest safety information retrieved",
    })
  }

  const handleEvacuate = () => {
    speakAlert("Evacuation protocol initiated. Proceed to nearest exit.")
    toast({
      title: "EVACUATION INITIATED",
      description: "Proceed to nearest emergency exit immediately",
      variant: "destructive",
    })
  }

  const handleEmergencyCall = (contact: EmergencyContact) => {
    // In a real app, this would initiate a phone call
    toast({
      title: `Calling ${contact.name}`,
      description: `${contact.role}: ${contact.phone}`,
    })
  }

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        setIsInstalled(true)
        toast({
          title: "App Installed",
          description: "Mine Safety App is now available offline",
        })
      }
      setDeferredPrompt(null)
    }
  }

  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-green-500"
    if (level > 20) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} p-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Mine Safety App</h1>
          <p className="text-sm text-white/70">Worker Protection System</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white/10 text-white border-white/20">
            {user?.name}
          </Badge>
          <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/10">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PWA Install Banner */}
      {!isInstalled && deferredPrompt && (
        <Card className="mb-6 bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Install App for Offline Access</p>
                <p className="text-xs text-white/70">Works without internet connection</p>
              </div>
              <Button onClick={installPWA} size="sm" className="bg-blue-500 hover:bg-blue-600">
                Install
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Card */}
      <Card className={`mb-6 ${config.borderColor} border-2  backdrop-blur-sm`}>
        <CardContent className="p-8 text-center">
          <div
            className={`w-32 h-32 rounded-full ${config.color} mx-auto mb-4 flex items-center justify-center animate-pulse`}
          >
            <StatusIcon className="h-16 w-16 text-white" />
          </div>
          <h2 className={`text-4xl font-bold mb-2 ${config.textColor}`}>{workerStatus.status.toUpperCase()}</h2>
          <p className="text-lg text-muted-foreground mb-4">{config.message}</p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <MapPin className="h-4 w-4 mr-2" />
              {workerStatus.zone}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              {workerStatus.lastUpdate.toLocaleTimeString()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      {workerStatus.status === "danger" && (
        <Button
          onClick={handleEvacuate}
          className="w-full h-20 text-2xl font-bold bg-red-500 hover:bg-red-600 text-white mb-6 animate-bounce"
        >
          <AlertCircle className="h-8 w-8 mr-3" />
          EVACUATE NOW
        </Button>
      )}

      {/* Emergency Contacts */}
      <Card className="mb-6  backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {emergencyContacts.map((contact, index) => (
            <Button
              key={index}
              onClick={() => handleEmergencyCall(contact)}
              variant="outline"
              className="w-full h-16 justify-start bg-transparent hover:bg-red-50 border-red-200"
            >
              <div className="text-left">
                <div className="font-semibold text-red-600">{contact.name}</div>
                <div className="text-sm text-muted-foreground">
                  {contact.role} • {contact.phone}
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Current Alerts */}
      <Card className="mb-6  backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Current Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {workerStatus.status === "danger" ? (
            <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
              <div className="flex items-center gap-2 text-red-500 font-semibold mb-2">
                <AlertCircle className="h-5 w-5" />
                High risk rockfall detected in {workerStatus.zone}
              </div>
              <p className="text-sm text-muted-foreground">Manager has requested immediate evacuation</p>
            </div>
          ) : workerStatus.status === "caution" ? (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-600 font-semibold mb-2">
                <AlertCircle className="h-5 w-5" />
                Weather conditions deteriorating
              </div>
              <p className="text-sm text-muted-foreground">Monitor conditions and be prepared to evacuate</p>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>No active alerts</p>
              <p className="text-sm">All systems normal</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button onClick={handleRefresh} variant="outline" className="h-16 backdrop-blur-sm">
          <RefreshCw className="h-5 w-5 mr-2" />
          <div className="text-left">
            <div className="font-semibold">Refresh</div>
            <div className="text-xs text-muted-foreground">Update Status</div>
          </div>
        </Button>

        <div className="flex items-center justify-center gap-3 p-4 backdrop-blur-sm rounded-lg border">
          {isOnline ? (
            <>
              <Wifi className="h-5 w-5 text-green-500" />
              <div className="text-left">
                <div className="font-semibold text-sm">Online</div>
                <div className="text-xs text-muted-foreground">Connected</div>
              </div>
            </>
          ) : (
            <>
              <WifiOff className="h-5 w-5 text-red-500" />
              <div className="text-left">
                <div className="font-semibold text-sm">Offline</div>
                <div className="text-xs text-muted-foreground">Cached Data</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Settings */}
      <Card className="mb-6  backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {voiceAlertsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span>Voice Alerts</span>
            </div>
            <Switch checked={voiceAlertsEnabled} onCheckedChange={setVoiceAlertsEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <span>Battery Level</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${getBatteryColor(workerStatus.batteryLevel).replace("text-", "bg-")}`}
                  style={{ width: `${workerStatus.batteryLevel}%` }}
                ></div>
              </div>
              <span className={`text-sm font-medium ${getBatteryColor(workerStatus.batteryLevel)}`}>
                {Math.round(workerStatus.batteryLevel)}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>GPS Coordinates</span>
            <span className="text-sm font-mono">
              {workerStatus.gpsCoordinates.lat.toFixed(4)}, {workerStatus.gpsCoordinates.lng.toFixed(4)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-white/70">
        <p>Last Update: {workerStatus.lastUpdate.toLocaleTimeString()}</p>
        <p className="mt-2">Powered by SIH 2025 | AI + IoT</p>
        {isInstalled && <p className="mt-1 text-green-300">✓ Offline Mode Available</p>}
      </div>
    </div>
  )
}
