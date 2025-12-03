"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  token: string
  usuarioId: number
  email: string
  nombreCompleto: string
  esTrabajador: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  activeRole: "CLIENTE" | "TRABAJADOR"
  login: (userData: User) => void
  logout: () => void
  toggleRole: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeRole, setActiveRole] = useState<"CLIENTE" | "TRABAJADOR">("CLIENTE")

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setActiveRole(userData.esTrabajador ? "TRABAJADOR" : "CLIENTE")
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error)
      // Clear corrupted storage
      localStorage.removeItem("user")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
    setActiveRole(userData.esTrabajador ? "TRABAJADOR" : "CLIENTE")
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    setActiveRole("CLIENTE")
  }

  const toggleRole = () => {
    setActiveRole((prev) => (prev === "CLIENTE" ? "TRABAJADOR" : "CLIENTE"))
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, activeRole, login, logout, toggleRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
