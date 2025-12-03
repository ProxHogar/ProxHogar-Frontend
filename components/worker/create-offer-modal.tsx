"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/custom-button"
import { X } from "lucide-react"

interface CreateOfferModalProps {
  solicitudId: number
  onClose: () => void
  onSubmit: (data: { montoOfrecido: number; comentario: string }) => void
}

export const CreateOfferModal: React.FC<CreateOfferModalProps> = ({ solicitudId, onClose, onSubmit }) => {
  const [montoOfrecido, setMontoOfrecido] = useState("")
  const [comentario, setComentario] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!montoOfrecido) {
      alert("Por favor, ingresa un monto.")
      return
    }
    onSubmit({
      montoOfrecido: parseFloat(montoOfrecido),
      comentario,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Enviar Mi Oferta</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="montoOfrecido" className="block text-sm font-medium text-slate-700 mb-1">
              ¿Cuánto quieres cobrar? (S/.)
            </label>
            <input
              type="number"
              id="montoOfrecido"
              value={montoOfrecido}
              onChange={(e) => setMontoOfrecido(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: 80.00"
              required
            />
          </div>

          <div>
            <label htmlFor="comentario" className="block text-sm font-medium text-slate-700 mb-1">
              Comentario (Opcional)
            </label>
            <textarea
              id="comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ej: Tengo experiencia y herramientas. Puedo empezar ahora mismo."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="success">
              Enviar Oferta
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
