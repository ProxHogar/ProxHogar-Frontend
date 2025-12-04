"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { ClientDashboard } from "@/components/client/client-dashboard"
import { WorkerDashboard } from "@/components/worker/worker-dashboard"
import { SubscriptionPage } from "@/components/subscription/subscription-page"
import { MyProfileView } from "@/components/common/my-profile-view"
import { WorkerVerification } from "@/components/worker/worker-verification"
import { LayoutDashboard, CreditCard, LogOut, Menu, ChevronRight, User } from "lucide-react"

export const DashboardLayout: React.FC = () => {
  const { user, activeRole, logout, switchToWorkerRole } = useAuth()
  const [view, setView] = useState("dashboard")
  const [showVerification, setShowVerification] = useState(false)


  const handleToggleRole = () => {
    setShowVerification(true)
  }

  const handleVerificationSuccess = async (dto: {
    biografia: string
    fotoBiometricaReferenciaUrl: string
    dni: string
    antecedentesPenalesVerificados: boolean
  }) => {
    try {
      await switchToWorkerRole(dto)
      setShowVerification(false)
    } catch (error) {
      console.error("Failed to switch to worker role from layout.")
    }
  }

  const handleVerificationCancel = () => {
    setShowVerification(false)
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <aside className="w-64 bg-white border-r hidden md:flex flex-col justify-between fixed h-full z-20">
        <div>
          <div className="h-20 flex items-center px-8 border-b">
            <span className="font-bold text-xl">ProxHogar</span>
          </div>
          <div className="p-4 space-y-1">
            <button
              onClick={() => setView("dashboard")}
              className={`w-full text-left px-4 py-3 rounded-xl flex gap-3 ${
                view === "dashboard" ? "bg-indigo-50 text-indigo-700 font-bold" : "hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" /> Panel
            </button>
            <button
              onClick={() => setView("planes")}
              className={`w-full text-left px-4 py-3 rounded-xl flex gap-3 ${
                view === "planes" ? "bg-indigo-50 text-indigo-700 font-bold" : "hover:bg-slate-50"
              }`}
            >
              <CreditCard className="w-5 h-5" /> Planes
            </button>
            <button
              onClick={() => setView("profile")}
              className={`w-full text-left px-4 py-3 rounded-xl flex gap-3 ${
                view === "profile" ? "bg-indigo-50 text-indigo-700 font-bold" : "hover:bg-slate-50"
              }`}
            >
              <User className="w-5 h-5" /> Mi Perfil
            </button>

            <div className="mt-8 bg-slate-900 text-white p-4 rounded-xl">
              <p className="text-xs opacity-50 mb-1">Rol Actual</p>
              <p className="font-bold mb-3">{activeRole}</p>
              <button
                onClick={handleToggleRole}
                disabled={user?.hasChangedToWorker}
                className="w-full bg-white/20 py-2 rounded text-xs flex justify-center gap-2 hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={user?.hasChangedToWorker ? "El cambio de rol solo se puede realizar una vez." : "Convertirse en trabajador"}
              >
                {user?.esTrabajador ? "Rol de Trabajador" : "Cambiar a Trabajador"} <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t">
          <button onClick={logout} className="flex gap-2 text-slate-500 hover:text-red-500">
            <LogOut className="w-5 h-5" /> Salir
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-8">
        <header className="flex justify-between items-center mb-8 md:hidden">
          <span className="font-bold">ProxHogar</span>
          <Menu className="w-6 h-6" />
        </header>

        
        {view === "dashboard" ? (
          activeRole === "CLIENTE" ? (
            <ClientDashboard />
          ) : (
            <WorkerDashboard />
          )
        ) : view === "planes" ? (
          <SubscriptionPage />
        ) : view === "profile" ? (
          <MyProfileView />
        ) : null}

      </main>

      {showVerification && (
        <WorkerVerification onSuccess={handleVerificationSuccess} onCancel={handleVerificationCancel} />
      )}
    </div>
  )
}