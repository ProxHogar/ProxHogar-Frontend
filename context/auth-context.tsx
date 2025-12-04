"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiCall } from "@/lib/api"

interface User {
  token: string
  usuarioId: number
  email: string
  nombreCompleto: string
  esTrabajador: boolean
  hasChangedToWorker: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  activeRole: "CLIENTE" | "TRABAJADOR"
  login: (userData: User) => void
  logout: () => void
  toggleRoleView: () => void
  switchToWorkerRole: (dto: {
    biografia: string
    fotoBiometricaReferenciaUrl: string
    dni: string
    antecedentesPenalesVerificados: boolean
  }) => Promise<void>
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
        if (userData.esTrabajador && !userData.hasChangedToWorker) {
            userData.hasChangedToWorker = true;
        } else if (!userData.hasChangedToWorker) {
            userData.hasChangedToWorker = false;
        }
        setUser(userData)
        setActiveRole(userData.esTrabajador ? "TRABAJADOR" : "CLIENTE")
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error)
      localStorage.removeItem("user")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (userData: User) => {
    console.log("Login: userData received:", userData);
    if (userData.esTrabajador && !userData.hasChangedToWorker) {
        userData.hasChangedToWorker = true;
    } else if (!userData.hasChangedToWorker) {
        userData.hasChangedToWorker = false;
    }
    localStorage.setItem("user", JSON.stringify(userData))
    console.log("Login: userData stored in localStorage:", userData);
    setUser(userData)
    setActiveRole(userData.esTrabajador ? "TRABAJADOR" : "CLIENTE")
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    setActiveRole("CLIENTE")
  }

  const switchToWorkerRole = async (dto: {
    biografia: string
    fotoBiometricaReferenciaUrl: string
    dni: string
    antecedentesPenalesVerificados: boolean
  }) => {
    if (!user || user.esTrabajador) return;

    setIsLoading(true);
    try {
      // Call the backend to create the 'Trabajador' entity
      await apiCall({
        endpoint: `/usuarios/convertir?usuarioId=${user.usuarioId}`,
        method: "POST",
        body: dto,
      });

      // On success, update the user state locally.
      // We don't spread the response, we just update the flags.
      const updatedUser: User = {
        ...user,
        esTrabajador: true,
        hasChangedToWorker: true,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setActiveRole("TRABAJADOR");

    } catch (error) {
      console.error("Error al convertirse en trabajador:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRoleView = () => {
    if (!user || isLoading) return;
    
    if (user.esTrabajador) {
        setActiveRole((prev) => (prev === "CLIENTE" ? "TRABAJADOR" : "CLIENTE"));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, activeRole, login, logout, toggleRoleView, switchToWorkerRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}