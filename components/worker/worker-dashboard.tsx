"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { CreateOfferModal } from "@/components/worker/create-offer-modal"
import { BiometricVerificationModal } from "@/components/worker/biometric-verification-modal"
import { useAuth } from "@/context/auth-context"
import { apiCall } from "@/lib/api"
import { Button } from "@/components/ui/custom-button"
import { Card } from "@/components/ui/custom-card"
import { MapPin, Star } from "lucide-react"
import { WorkerAcceptedJobs } from "./worker-accepted-jobs"

export const WorkerDashboard: React.FC = () => {
  // Main states
  const { user } = useAuth()
  const [jobs, setJobs] = useState<any[]>([])
  const [acceptedJobs, setAcceptedJobs] = useState<any[]>([])
  const [myProfile, setMyProfile] = useState<any>(null)
  const [tab, setTab] = useState<"disponibles" | "aceptados" | "historial">("disponibles")

  // Modal states
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const [verifyingJobId, setVerifyingJobId] = useState<number | null>(null)

  // Load all data on mount and when user changes
  useEffect(() => {
    if (user?.usuarioId) {
      loadData()
    }
  }, [user])

  const loadData = () => {
    if (!user?.usuarioId) return
    Promise.all([
      apiCall({ endpoint: "/solicitudes/disponibles" }),
      apiCall({ endpoint: `/solicitudes/mis-trabajos?usuarioId=${user.usuarioId}` }),
      apiCall({ endpoint: `/trabajadores/usuario/${user.usuarioId}` }),
    ])
      .then(([disponibles, aceptados, profile]) => {
        setJobs(disponibles)
        setAcceptedJobs(aceptados)
        setMyProfile(profile)
      })
      .catch((err) => console.error("Error fetching worker data:", err))
  }

  // --- Offer Modal Handlers ---
  const handleOpenOfferModal = (jobId: number) => {
    setSelectedJobId(jobId)
    setIsOfferModalOpen(true)
  }
  const handleCloseOfferModal = () => {
    setSelectedJobId(null)
    setIsOfferModalOpen(false)
  }
  const handleSendOffer = async (data: { montoOfrecido: number; comentario: string }) => {
    if (!selectedJobId || !user) return
    try {
      await apiCall({
        endpoint: `/ofertas?trabajadorUsuarioId=${user.usuarioId}`,
        method: "POST",
        body: { solicitudId: selectedJobId, ...data },
      })
      alert("¡Oferta enviada con éxito!")
      handleCloseOfferModal()
      loadData()
    } catch (error) {
      console.error("Error al enviar la oferta:", error)
      alert("Hubo un error al enviar tu oferta.")
    }
  }

  // --- Job Lifecycle Handlers ---
  const openBiometricModal = (jobId: number) => {
    setVerifyingJobId(jobId)
  }

  const handleVerificationSuccess = async (jobId: number) => {
    if (!user) return
    try {
      await apiCall({
        endpoint: `/solicitudes/${jobId}/iniciar?trabajadorUsuarioId=${user.usuarioId}`,
        method: "PUT",
      })
      alert("Trabajo iniciado. ¡Buena suerte!")
      loadData()
    } catch (err) {
      console.error("Error al iniciar trabajo:", err)
      alert("No se pudo iniciar el trabajo.")
    }
  }

  const handleJobFinish = async (jobId: number) => {
    if (!user) return
    try {
      await apiCall({
        endpoint: `/solicitudes/${jobId}/trabajador-finalizar?trabajadorUsuarioId=${user.usuarioId}`,
        method: "PUT",
      })
      alert("¡Trabajo marcado como finalizado! El cliente será notificado para realizar el pago.")
      loadData()
    } catch (err) {
      console.error("Error al finalizar trabajo:", err)
      alert("No se pudo finalizar el trabajo.")
    }
  }

  const handleJobAction = (action: "start" | "finish", jobId: number) => {
    switch (action) {
      case "start":
        openBiometricModal(jobId)
        break
      case "finish":
        handleJobFinish(jobId)
        break
    }
  }

  // --- Data Filtering for Tabs ---
  const activeAcceptedJobs = acceptedJobs.filter(
    (job) => job.estado === "ACEPTADO" || job.estado === "EN_PROCESO"
  )
  const finishedJobs = acceptedJobs.filter(
    (job) => job.estado === "FINALIZADO_POR_TRABAJADOR" || job.estado === "FINALIZADA" || job.estado === "CANCELADA"
  )

  return (
    <>
      <div className="space-y-6 max-w-5xl mx-auto p-4">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 text-white p-6 rounded-2xl">
            <p className="text-slate-400 text-sm">Ganancias</p>
            <h3 className="text-3xl font-bold">S/. 450</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <p className="text-slate-500 text-sm">Calificación</p>
            <h3 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
              <Star className="w-7 h-7 text-yellow-400" />
              {myProfile?.calificacionPromedio?.toFixed(1) || "N/A"}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <p className="text-slate-500 text-sm">Trabajos Completados</p>
            <h3 className="text-3xl font-bold text-slate-800">{myProfile?.trabajosCompletados || 0}</h3>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setTab("disponibles")}
            className={`px-4 py-2 font-medium transition-colors ${tab === "disponibles" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            Disponibles
          </button>
          <button
            onClick={() => setTab("aceptados")}
            className={`px-4 py-2 font-medium transition-colors relative ${tab === "aceptados" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            Mis Trabajos
            {activeAcceptedJobs.length > 0 && <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5">{activeAcceptedJobs.length}</span>}
          </button>
          <button
            onClick={() => setTab("historial")}
            className={`px-4 py-2 font-medium transition-colors ${tab === "historial" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            Historial
          </button>
        </div>

        {/* Conditional Content */}
        {tab === "disponibles" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job: any) => (
              <Card key={job.id}>
                {/* ... job card content ... */}
                <div className="flex justify-between mb-2">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold">#{job.id}</span>
                  <span className="font-bold text-emerald-600">S/. {job.precioSugerido}</span>
                </div>
                <h4 className="font-bold text-slate-800 mb-2">{job.descripcion}</h4>
                <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {job.direccion}
                </p>
                <Button className="w-full" onClick={() => handleOpenOfferModal(job.id)}>Postularme</Button>
              </Card>
            ))}
            {jobs.length === 0 && <p className="col-span-full text-center py-8 text-slate-400">No hay trabajos disponibles.</p>}
          </div>
        )}
        {tab === "aceptados" && (
          <WorkerAcceptedJobs jobs={activeAcceptedJobs} onJobAction={handleJobAction} />
        )}
        {tab === "historial" && (
          <WorkerAcceptedJobs jobs={finishedJobs} onJobAction={() => {}} isHistory={true} />
        )}
      </div>

      {isOfferModalOpen && selectedJobId && (<CreateOfferModal solicitudId={selectedJobId} onClose={handleCloseOfferModal} onSubmit={handleSendOffer}/>)}
      {verifyingJobId && (<BiometricVerificationModal solicitudId={verifyingJobId} onClose={() => setVerifyingJobId(null)} onSuccess={handleVerificationSuccess}/>)}
    </>
  )
}
