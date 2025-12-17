"use client"

import type React from "react"

import { useState } from "react"
import { X, Star } from "lucide-react"
import { Button } from "@/components/ui/custom-button"

interface ReviewModalProps {
  workerUsuarioId: number
  workerName: string
  requestId: number
  onClose: () => void
  onSubmit: (rating: number, comment: string) => void
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ workerUsuarioId, workerName, requestId, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Selecciona una calificación")
      return
    }

    setLoading(true)
    setTimeout(() => {
      onSubmit(rating, comment)
      setLoading(false)
      onClose()
    }, 800)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom-4">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Calificar Trabajo</h3>
            <p className="text-sm text-slate-500">Servicio de {workerName}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Calificación</label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                  <Star
                    className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Comentario</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cuéntanos sobre tu experiencia con este trabajador..."
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={4}
            />
            <p className="text-xs text-slate-400 mt-1">{comment.length}/500</p>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-2xl flex gap-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading || rating === 0} className="flex-1">
            {loading ? "Enviando..." : "Enviar Calificación"}
          </Button>
        </div>
      </div>
    </div>
  )
}
