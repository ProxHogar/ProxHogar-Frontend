"use client"

import type React from "react"
import { useState } from "react"
import { Sparkles, X, Loader } from "lucide-react"
import { Button } from "@/components/ui/custom-button"
import { callGeminiLLM } from "@/utils/gemini"
import { apiCall } from "@/lib/api"

interface Category {
  id: number
  nombre: string
  urlIcono: string
}

interface CreateRequestFormProps {
  userId: number
  categories: Category[]
  editingId?: number | null
  initialForm?: any
  onSuccess: () => void
  onCancel: () => void
}

export const CreateRequestForm: React.FC<CreateRequestFormProps> = ({
  userId,
  categories,
  editingId,
  initialForm,
  onSuccess,
  onCancel,
}) => {
  const [form, setForm] = useState(
    initialForm || {
      catId: 1,
      desc: "",
      price: "",
      addr: "",
      lat: -8.11,
      lng: -79.03,
    },
  )

  const [loadingAI, setLoadingAI] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const improveWithAI = async () => {
    if (!form.desc) return
    setLoadingAI(true)
    const prompt = `Mejora esta descripción corta para una solicitud de trabajo en casa (sé conciso, profesional y claro): "${form.desc}"`
    const improved = await callGeminiLLM(prompt)
    if (improved) setForm({ ...form, desc: improved })
    setLoadingAI(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = {
        categoriaId: form.catId,
        descripcion: form.desc,
        precioSugerido: Number.parseFloat(form.price),
        direccion: form.addr,
        referencia: "Web",
        latitud: form.lat,
        longitud: form.lng,
      }

      if (editingId) {
        await apiCall({
          endpoint: `/solicitudes/${editingId}?clienteId=${userId}`,
          method: "PUT",
          body: payload,
        })
        alert("Solicitud Actualizada")
        onSuccess()
      } else {
        await apiCall({
          endpoint: `/solicitudes?clienteId=${userId}`,
          method: "POST",
          body: payload,
        })
        alert("Solicitud Creada")
        onSuccess()
      }
    } catch (err) {
      alert("Error al crear la solicitud")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm max-w-3xl mx-auto animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">{editingId ? "Editar Solicitud" : "Crear Solicitud"}</h3>
        <button onClick={onCancel} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-bold text-slate-700 block mb-3">Selecciona Categoría</label>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((c) => (
              <div
                key={c.id}
                onClick={() => setForm({ ...form, catId: c.id })}
                className={`cursor-pointer min-w-[120px] p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  form.catId === c.id
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-100 hover:border-slate-300"
                }`}
              >
                <img
                  src={c.urlIcono || "/placeholder.svg"}
                  className="w-8 h-8 opacity-75"
                  onError={(e) => (e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/1087/1087815.png")}
                  alt={c.nombre}
                />
                <span className="text-xs font-bold">{c.nombre}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-bold text-slate-700">Descripción</label>
              <button
                type="button"
                onClick={improveWithAI}
                disabled={loadingAI}
                className="text-xs text-indigo-600 font-bold flex items-center gap-1 hover:text-indigo-700 disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" /> {loadingAI ? "Generando..." : "Mejorar con IA"}
              </button>
            </div>
            <textarea
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
              rows={3}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              value={form.desc}
              placeholder="Describe el servicio que necesitas..."
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">Precio (S/.)</label>
            <input
              required
              type="number"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              value={form.price}
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 block mb-2">Dirección</label>
            <input
              required
              type="text"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setForm({ ...form, addr: e.target.value })}
              value={form.addr}
              placeholder="Tu dirección..."
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader className="w-4 h-4 animate-spin" /> : null}
            {editingId ? "Guardar Cambios" : "Publicar Ahora"}
          </Button>
        </div>
      </form>
    </div>
  )
}
