"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { apiCall } from "@/lib/api"
import { Button } from "@/components/ui/custom-button"
import { PaymentModal } from "@/components/common/payment-modal"
import { CheckCircle } from "lucide-react"

export const SubscriptionPage: React.FC = () => {
  const { user, activeRole } = useAuth()
  const [plans, setPlans] = useState<any[]>([])
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null)

  useEffect(() => {
    if (activeRole) {
      apiCall({ endpoint: `/suscripciones/planes?rol=${activeRole}` }).then(setPlans)
    }
  }, [activeRole])

  const handleSubscribeClick = (plan: any) => {
    if (plan.precio === 0) {
      // Handle free plan directly
      handlePaymentSuccess(plan.id)
    } else {
      setSelectedPlan(plan)
    }
  }

  const handlePaymentSuccess = async (planIdToSubscribe?: number) => {
    const finalPlanId = planIdToSubscribe || selectedPlan?.id
    if (!finalPlanId || !user) {
      alert("Error: No se pudo determinar el plan o el usuario.")
      return
    }

    try {
      await apiCall({
        endpoint: `/suscripciones/suscribir?usuarioId=${user.usuarioId}`,
        method: "POST",
        body: {
          planId: finalPlanId,
          meses: 1, // Defaulting to 1 month
        },
      })
      alert("¡Suscripción activada con éxito!")
      setSelectedPlan(null)
      // Here you might want to refetch user data or redirect
    } catch (error) {
      console.error("Error al suscribirse:", error)
      alert("Hubo un error al procesar tu suscripción.")
    }
  }

  return (
    <>
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          Planes para {activeRole === "TRABAJADOR" ? "Profesionales" : "Clientes"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan: any) => (
            <div
              key={plan.id}
              className={`bg-white p-8 rounded-3xl border transition-all ${
                plan.recomendado ? "border-indigo-500 shadow-xl scale-105" : "border-slate-200"
              }`}
            >
              <h3 className="font-bold text-xl text-slate-800">{plan.nombre}</h3>
              <div className="my-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">S/.{plan.precio}</span>
                <span className="text-sm text-slate-500">{plan.periodo}</span>
              </div>
              <ul className="space-y-2 mb-8">
                {plan.features.split("|").map((f: string, i: number) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.recomendado ? "primary" : "secondary"}
                onClick={() => handleSubscribeClick(plan)}
              >
                {plan.precio === 0 ? "Activar Gratis" : "Seleccionar"}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          requestId={selectedPlan.id} // Using planId as a unique identifier for the modal
          amount={selectedPlan.precio}
          onClose={() => setSelectedPlan(null)}
          onPaymentSuccess={() => handlePaymentSuccess()}
        />
      )}
    </>
  )
}
