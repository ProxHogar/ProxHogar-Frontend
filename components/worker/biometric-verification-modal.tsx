"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/custom-button"
import { apiCall } from "@/lib/api"
import { X, Camera, MapPin, Loader } from "lucide-react"

interface BiometricVerificationModalProps {
  solicitudId: number
  onClose: () => void
  onSuccess: (solicitudId: number) => void
}

export const BiometricVerificationModal: React.FC<BiometricVerificationModalProps> = ({
  solicitudId,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerification = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1. Simulate getting GPS location
      const location = await new Promise<{ lat: number; lng: number }>((resolve) =>
        setTimeout(() => resolve({ lat: -8.11, lng: -79.03 }), 500)
      )

      // 2. Simulate taking a selfie and getting a URL
      const selfieUrl = "https://this-person-does-not-exist.com/img/avatar-1126a908256a7e1329a3512b963155d0.jpg"

      // 3. Call backend for verification
      const verificationResult = await apiCall({
        endpoint: "/biometria/verificar",
        method: "POST",
        body: {
          solicitudId: solicitudId,
          latitudActual: location.lat,
          longitudActual: location.lng,
          fotoSelfieUrl: selfieUrl,
        },
      })

      // 4. Check result and call onSuccess
      if (verificationResult.exito) {
        alert("Verificación biométrica exitosa.")
        onSuccess(solicitudId)
        onClose()
      } else {
        throw new Error(verificationResult.mensaje || "La verificación biométrica ha fallado.")
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado durante la verificación.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-4">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Verificación de Identidad</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 text-center">
          <p className="text-slate-600 mb-6">
            Para garantizar la seguridad, por favor completa una verificación rápida antes de iniciar el trabajo.
          </p>
          <div className="flex justify-center gap-8 text-slate-500 mb-8">
            <div className="flex flex-col items-center gap-2">
              <Camera className="w-8 h-8" />
              <span className="text-xs font-medium">Selfie Rápida</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-8 h-8" />
              <span className="text-xs font-medium">Ubicación GPS</span>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>}

          <Button onClick={handleVerification} disabled={loading} className="w-full">
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : "Iniciar Verificación"}
          </Button>
        </div>
      </div>
    </div>
  )
}
