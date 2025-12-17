"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { apiCall } from "@/lib/api"
import { Button } from "@/components/ui/custom-button"
import { Card } from "@/components/ui/custom-card"
import { Badge } from "@/components/ui/custom-badge"
import { OffersModal } from "@/components/common/offers-modal"
import { CreateRequestForm } from "./create-request-form"
import { Edit, Trash2, Calendar } from "lucide-react"
import { PaymentModal } from "@/components/common/payment-modal"
import { ReviewModal } from "@/components/common/review-modal"

export const ClientDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState("list")
  const [cats, setCats] = useState<any[]>([])
  const [reqs, setReqs] = useState<any[]>([])
  const [viewOffersId, setViewOffersId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingReq, setEditingReq] = useState<any>(null)
  const [paymentModalId, setPaymentModalId] = useState<number | null>(null)
  const [reviewModalData, setReviewModalData] = useState<{
    requestId: number
    workerUsuarioId: number
    workerName: string
  } | null>(null)

  useEffect(() => {
    if (!user || !user.usuarioId) {
      console.warn("Usuario sin ID detectado. Cerrando sesión para limpiar cache.")
      logout()
      return
    }
    loadData()
  }, [user])

  const loadData = () => {
    if (!user?.usuarioId) return
    apiCall({ endpoint: "/categorias" }).then(setCats)
    apiCall({
      endpoint: `/solicitudes/mis-pedidos?clienteId=${user.usuarioId}`,
      method: "GET",
    }).then(setReqs)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta solicitud?")) return
    if (!user?.usuarioId) return
    try {
      await apiCall({
        endpoint: `/solicitudes/${id}?clienteId=${user.usuarioId}`,
        method: "DELETE",
      })
      loadData()
    } catch (e) {
      alert("Error al eliminar")
    }
  }

  const startEditing = (req: any) => {
    setEditingId(req.id)
    setEditingReq({
      catId: req.categoriaId || 1,
      desc: req.descripcion,
      price: req.precioSugerido,
      addr: req.direccion,
      lat: req.latitud || -8.11,
      lng: req.longitud || -79.03,
    })
    setTab("create")
  }

  const handleFormSuccess = () => {
    setTab("list") // Always go back to the list
    setEditingId(null)
    setEditingReq(null)
    loadData()
  }

  const handlePaymentSuccess = async (requestId: number) => {
    if (!user) return
    try {
      // 1. Finalizar la solicitud en el backend
      await apiCall({
        endpoint: `/solicitudes/${requestId}/finalizar?clienteId=${user.usuarioId}`,
        method: "PUT",
      })

      // 2. Abrir el modal de reseña
      const req = reqs.find((r) => r.id === requestId)
      if (req && req.trabajadorElegido && req.trabajadorElegido.usuario) {
        setReviewModalData({
          requestId,
          workerUsuarioId: req.trabajadorElegido.usuario.id,
          workerName: req.trabajadorElegido.usuario.nombreCompleto || "Trabajador",
        })
      } else {
        // Si no podemos abrir el modal de reseña, al menos recargamos los datos
        // para que la solicitud finalizada se mueva al historial.
        loadData()
      }
    } catch (error) {
      console.error("Error al finalizar la solicitud:", error)
      alert("Hubo un error al finalizar la solicitud. Por favor, recarga la página.")
    }
  }

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!reviewModalData) return

    try {
      await apiCall({
        endpoint: `/resenas`,
        method: "POST",
        body: {
          solicitudId: reviewModalData.requestId,
          usuarioCalificadoId: reviewModalData.workerUsuarioId,
          estrellas: rating,
          comentario: comment,
        },
      })
      setReviewModalData(null)
      loadData()
    } catch (e) {
      alert("Error al enviar la calificación")
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Hola, {user?.nombreCompleto?.split(" ")[0] || "Usuario"}
          </h2>
          <p className="text-slate-500 text-sm">Gestiona tus servicios.</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setEditingReq(null)
            setTab("create")
          }}
        >
          + Nueva Solicitud
        </Button>
      </div>

      <div className="flex gap-6 border-b border-slate-200">
        <button
          onClick={() => setTab("list")}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${tab === "list" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"}`}
        >
          Activos
        </button>
        <button
          onClick={() => setTab("history")}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${tab === "history" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"}`}
        >
          Historial Completo
        </button>
      </div>

      {tab === "create" && user ? (
        <CreateRequestForm
          userId={user.usuarioId}
          categories={cats}
          editingId={editingId}
          initialForm={editingReq}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setTab("list")
            setEditingId(null)
            setEditingReq(null)
          }}
        />
      ) : tab === "create" && !user ? (
        <div className="col-span-2 text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-400">Inicia sesión para crear una solicitud.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(tab === "list"
            ? reqs.filter(r => r.estado !== "FINALIZADA" && r.estado !== "CANCELADA")
            : reqs.filter(r => r.estado === "FINALIZADA" || r.estado === "CANCELADA")
          ).map((req: any) => (
            <Card key={req.id}>
              <div className="flex justify-between mb-2">
                <Badge status={req.estado} />
                <span className="text-xs text-slate-400">#{req.id}</span>
              </div>
              <h3 className="font-bold text-slate-800">{req.descripcion}</h3>
              <p className="text-sm text-slate-500 mb-4">{req.direccion}</p>
              <div className="flex gap-2 text-xs text-slate-400 mb-4">
                <Calendar className="w-3 h-3" /> <span>{req.createdAt || "Hoy"}</span>
              </div>
              <div className="pt-4 border-t flex justify-between items-center">
                <span className="font-bold text-indigo-600">S/. {req.precioSugerido}</span>
                <div className="flex gap-2">
                  {req.estado === "PENDIENTE" && (
                    <>
                      <button
                        onClick={() => startEditing(req)}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(req.id)}
                        className="p-2 hover:bg-rose-50 rounded-full text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {req.estado === "OFERTANDO" && (
                    <Button variant="secondary" className="text-xs h-8" onClick={() => setViewOffersId(req.id)}>
                      Ver Ofertas
                    </Button>
                  )}
                  {req.estado === "FINALIZADO_POR_TRABAJADOR" && (
                    <Button variant="success" className="text-xs h-8" onClick={() => setPaymentModalId(req.id)}>
                      Pagar y Finalizar
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {reqs.length > 0 &&
            (tab === "list"
              ? reqs.filter(r => r.estado !== "FINALIZADA" && r.estado !== "CANCELADA")
              : reqs.filter(r => r.estado === "FINALIZADA" || r.estado === "CANCELADA")
            ).length === 0 && (
              <div className="col-span-2 text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-slate-400">No hay solicitudes en esta sección.</p>
              </div>
            )}
        </div>
      )}

      {viewOffersId && user && (
        <OffersModal reqId={viewOffersId} onClose={() => setViewOffersId(null)} user={user} onAccept={loadData} />
      )}

      {paymentModalId && (
        <PaymentModal
          requestId={paymentModalId}
          amount={reqs.find((r) => r.id === paymentModalId)?.precioSugerido || 0}
          onClose={() => setPaymentModalId(null)}
          onPaymentSuccess={() => handlePaymentSuccess(paymentModalId)}
        />
      )}

      {reviewModalData && (
        <ReviewModal
          requestId={reviewModalData.requestId}
          workerUsuarioId={reviewModalData.workerUsuarioId}
          workerName={reviewModalData.workerName}
          onClose={() => setReviewModalData(null)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  )
}
