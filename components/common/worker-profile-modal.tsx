"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Shield, Star, MessageSquare, Loader } from "lucide-react"
import { apiCall } from "@/lib/api"
import { Button } from "@/components/ui/custom-button"

interface WorkerProfileModalProps {
  worker: any
  user: any
  onClose: () => void
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({ worker, onClose, user }) => {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!worker?.usuario?.id) return

    apiCall({
      endpoint: `/resenas/usuario/${worker.usuario.id}`,
      method: "GET",
    })
      .then(setReviews)
      .finally(() => setLoading(false))
  }, [worker])

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="bg-slate-900 text-white p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-2xl font-bold border-4 border-white/10">
              {worker.usuario.nombreCompleto.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                {worker.usuario.nombreCompleto}
                {worker.verificado && <Shield className="w-4 h-4 text-emerald-400 fill-current" />}
              </h3>
              <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium mt-1">
                <Star className="w-4 h-4 fill-current" /> {worker.calificacionPromedio}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Biografía</h4>
            <p className="text-slate-700 bg-slate-50 p-4 rounded-xl text-sm leading-relaxed">
              {worker.biografia || "Sin biografía disponible."}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Comentarios ({reviews.length})
            </h4>
            {loading ? (
              <div className="text-center py-4">
                <Loader className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-slate-500 text-sm italic">Sin reseñas.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev: any) => (
                  <div key={rev.id} className="border-b border-slate-100 pb-3 last:border-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-sm text-slate-800">{rev.autor.nombreCompleto}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex text-yellow-400 w-3 h-3 gap-0.5 mb-1">
                      {[...Array(rev.calificacion)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-600">"{rev.comentario}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t bg-slate-50 text-center">
          <Button variant="secondary" onClick={onClose} className="w-full">
            Cerrar Perfil
          </Button>
        </div>
      </div>
    </div>
  )
}
