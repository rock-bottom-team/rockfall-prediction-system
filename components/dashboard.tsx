"use client"

import { useAuth } from "@/components/auth-provider"
import { EngineerDashboard } from "@/components/engineer-dashboard"
import { ManagerDashboard } from "@/components/manager-dashboard"
import { WorkerDashboard } from "@/components/worker-dashboard"

export function Dashboard() {
  const { user } = useAuth()

  if (!user) return null

  switch (user.role) {
    case "engineer":
      return <EngineerDashboard />
    case "manager":
      return <ManagerDashboard />
    case "worker":
      return <WorkerDashboard />
    default:
      return <EngineerDashboard />
  }
}
