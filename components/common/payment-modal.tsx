"use client"

import type React from "react"

import { useState } from "react"
import { X, CreditCard, Smartphone, Banknote } from "lucide-react"
import { Button } from "@/components/ui/custom-button"

interface PaymentModalProps {
  requestId: number
  amount: number
  onClose: () => void
  onPaymentSuccess: () => void
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ requestId, amount, onClose, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const paymentMethods = [
    {
      id: "card",
      name: "Tarjeta de Crédito/Débito",
      icon: CreditCard,
      description: "Visa, Mastercard, American Express",
    },
    {
      id: "yape",
      name: "Yape",
      icon: Smartphone,
      description: "Pago por teléfono",
    },
    {
      id: "transfer",
      name: "Transferencia Bancaria",
      icon: Banknote,
      description: "Transferencia a cuenta bancaria",
    },
  ]

  const handlePay = async () => {
    if (!selectedMethod) {
      alert("Selecciona un método de pago")
      return
    }

    setLoading(true)
    // Simulate payment processing
    setTimeout(() => {
      alert(`Pago de S/. ${amount} procesado con ${selectedMethod}`)
      onPaymentSuccess()
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom-4">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Selecciona Método de Pago</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-start gap-3 text-left ${
                  selectedMethod === method.id
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-slate-200 hover:border-indigo-300"
                }`}
              >
                <Icon className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">{method.name}</p>
                  <p className="text-xs text-slate-500">{method.description}</p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
          <div className="mb-4 p-4 bg-white rounded-lg border border-slate-200">
            <p className="text-sm text-slate-500">Monto a pagar</p>
            <p className="text-2xl font-bold text-indigo-600">S/. {amount}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handlePay} disabled={loading} className="flex-1">
              {loading ? "Procesando..." : "Confirmar Pago"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
