"use client"

import type React from "react"
import { Card } from "@/components/ui/custom-card"
import { Button } from "@/components/ui/custom-button"
import { MapPin, User, Phone, CheckCircle, X } from "lucide-react"

interface AcceptedJobsProps {
  jobs: any[]
  onJobAction: (action: "start" | "finish", jobId: number) => void
  isHistory?: boolean
}

export const WorkerAcceptedJobs: React.FC<AcceptedJobsProps> = ({ jobs, onJobAction, isHistory = false }) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
        <p className="text-slate-400">
          {isHistory ? "No tienes trabajos en tu historial." : "No tienes trabajos aceptados por el momento."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <Card key={job.id} className="bg-white">
          <div className="flex justify-between mb-2">
            <span className="text-xs bg-slate-100 px-2 py-1 rounded font-bold">#{job.id}</span>
            <span className="font-bold text-emerald-600">S/. {job.precioSugerido}</span>
          </div>
          <h4 className="font-bold text-slate-800 mb-2">{job.descripcion}</h4>
          <div className="text-sm text-slate-500 space-y-2 mt-4 pt-4 border-t">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" /> {job.direccion}
            </p>
            <p className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" /> {job.cliente?.nombreCompleto || "Cliente Anónimo"}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" /> {job.cliente?.telefono || "No disponible"}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t">
            {job.estado === "ACEPTADO" && (
              <Button className="w-full" onClick={() => onJobAction("start", job.id)}>
                Iniciar Trabajo
              </Button>
            )}
            {job.estado === "EN_PROCESO" && (
              <Button className="w-full" variant="success" onClick={() => onJobAction("finish", job.id)}>
                Finalizar Trabajo
              </Button>
            )}
            {(job.estado === "FINALIZADA" || job.estado === "FINALIZADO_POR_TRABAJADOR") && (
               <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 font-bold py-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Trabajo Completado</span>
               </div>
            )}
             {job.estado === "CANCELADA" && (
                <div className="flex items-center justify-center gap-2 text-sm text-rose-600 font-bold py-2">
                    <X className="w-4 h-4" />
                    <span>Cancelado</span>
                </div>
             )}
          </div>
        </Card>
      ))}
    </div>
  )
}