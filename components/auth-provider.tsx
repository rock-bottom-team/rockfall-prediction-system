"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "engineer" | "manager" | "worker"

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("mine-safety-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call - in real app, this would validate credentials
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo credentials for SIH presentation
    const validCredentials = [
      { email: "engineer@mine.com", password: "demo123", role: "engineer" },
      { email: "manager@mine.com", password: "demo123", role: "manager" },
      { email: "worker@mine.com", password: "demo123", role: "worker" },
      { email: "demo", password: "demo", role: role }, // Guest login for judges
    ]

    const isValid = validCredentials.some(
      (cred) => cred.email === email && cred.password === password && cred.role === role,
    )

    if (isValid) {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        role,
        name: role.charAt(0).toUpperCase() + role.slice(1),
      }

      setUser(newUser)
      localStorage.setItem("mine-safety-user", JSON.stringify(newUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("mine-safety-user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
