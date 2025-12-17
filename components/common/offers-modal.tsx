"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Shield, Star } from "lucide-react"
import { apiCall } from "@/lib/api"
import { Button } from "@/components/ui/custom-button"
import { WorkerProfileModal } from "./worker-profile-modal"

interface OffersModalProps {
  reqId: number
  user: any
  onClose: () => void
  onAccept: () => void
}

export const OffersModal: React.FC<OffersModalProps> = ({ reqId, onClose, user, onAccept }) => {
  const [list, setList] = useState<any[]>([])
  const [selectedWorker, setSelectedWorker] = useState<any>(null)

  useEffect(() => {
    apiCall({
      endpoint: `/ofertas/solicitud/${reqId}`,
      method: "GET",
    })
      .then(setList)
      .catch(console.error)
  }, [reqId])

  const handleAccept = async (oid: number) => {
    if (!confirm("¿Aceptar esta oferta?")) return
    await apiCall({
      endpoint: `/ofertas/${oid}/aceptar`,
      method: "PUT",
    })
    alert("Oferta Aceptada")
    onAccept()
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between mb-4">
            <h3 className="font-bold">Ofertas Recibidas</h3>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          <div className="space-y-3">
            {list.map((o: any) => (
              <div key={o.id} className="border p-4 rounded-xl hover:border-indigo-200 transition-all bg-slate-50">
                <div className="flex justify-between items-start mb-3">
                  <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => {
                      console.log("Selected worker data:", o.trabajador)
                      setSelectedWorker(o.trabajador)
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                      {o.trabajador.usuario.nombreCompleto.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                        {o.trabajador.usuario.nombreCompleto}
                        {o.trabajador.verificado && <Shield className="w-3 h-3 text-emerald-500 fill-current" />}
                      </p>
                      <div className="flex text-xs text-yellow-500">
                        <Star className="w-3 h-3 fill-current" /> {o.trabajador.calificacionPromedio}
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-lg text-emerald-600">S/. {o.montoOfrecido}</span>
                </div>
                <p className="text-sm text-slate-600 italic mb-3">"{o.comentario}"</p>
                <Button onClick={() => handleAccept(o.id)} variant="success" className="w-full text-xs py-2">
                  Aceptar y Contratar
                </Button>
              </div>
            ))}
            {list.length === 0 && <p className="text-center text-slate-400 py-4">Aún no hay ofertas.</p>}
          </div>
        </div>
      </div>

      {selectedWorker && (
        <WorkerProfileModal worker={selectedWorker} onClose={() => setSelectedWorker(null)} user={user} />
      )}
    </>
  )
}
