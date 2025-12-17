"use client"

import type React from "react"
import { useState } from "react"
import { AlertCircle, CheckCircle2, Loader, X, UploadCloud } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface WorkerVerificationProps {
  onSuccess: (dto: {
    biografia: string
    fotoBiometricaReferenciaUrl: string
    dni: string
    antecedentesPenalesVerificados: boolean
  }) => void
  onCancel: () => void
}

export const WorkerVerification: React.FC<WorkerVerificationProps> = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState<"dni" | "background" | "success">("dni")
  const [dniNumber, setDniNumber] = useState("")
  const [biografia, setBiografia] = useState("")
  const [fotoUrl, setFotoUrl] = useState("")
  const [antecedentesPenalesVerificados, setAntecedentesPenalesVerificados] = useState(true)
  const [photoUploaded, setPhotoUploaded] = useState(false) // New state for UI feedback
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSimulateUpload = () => {
    setLoading(true)
    // Simulate a quick network request
    setTimeout(() => {
      setFotoUrl(`https://i.pravatar.cc/150?u=${dniNumber || Math.random()}`)
      setPhotoUploaded(true)
      setError("")
      setLoading(false)
    }, 800)
  }

  const handleDNIVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (dniNumber.length !== 8 || !biografia || !fotoUrl) {
      setError("Todos los campos son obligatorios.")
      setLoading(false)
      return
    }

    if (Math.random() > 0.9) {
      setError("DNI no válido en el sistema. Por favor verifica los datos.")
      setLoading(false)
      return
    }

    setStep("background")
    setLoading(false)
  }

  const handleBackgroundCheck = async () => {
    setLoading(true)
    setError("")

    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate a failure in background check
    if (Math.random() > 0.95) {
      setError("No se puede completar la verificación. Contacta a soporte.")
      setAntecedentesPenalesVerificados(false) // Set the flag to false on failure
      setLoading(false)
      // We don't return here, we still want to proceed to the success step
      // to record the result of the verification. The backend will store
      // that the verification was attempted but failed.
    } else {
      setAntecedentesPenalesVerificados(true)
    }


    setStep("success")
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">Verificación de Identidad</h2>
            <button
              onClick={onCancel}
              disabled={loading}
              className="p-1 hover:bg-white/10 rounded-full disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-indigo-100 text-sm">Requerido para trabajar en ProxHogar</p>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <div
              className={`flex-1 h-2 rounded-full ${step === "dni" || step === "background" || step === "success" ? "bg-indigo-600" : "bg-slate-200"}`}
            />
            <div
              className={`flex-1 h-2 rounded-full ${step === "background" || step === "success" ? "bg-indigo-600" : "bg-slate-200"}`}
            />
            <div className={`flex-1 h-2 rounded-full ${step === "success" ? "bg-indigo-600" : "bg-slate-200"}`} />
          </div>

          {step === "dni" && (
            <form onSubmit={handleDNIVerification} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Número de DNI</label>
                <input
                  type="text"
                  maxLength={8}
                  placeholder="12345678"
                  value={dniNumber}
                  onChange={(e) => {
                    setDniNumber(e.target.value.replace(/\D/g, ""))
                    setError("")
                  }}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none font-mono text-lg tracking-widest"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Biografía</label>
                <Textarea
                  placeholder="Cuéntanos sobre tu experiencia..."
                  value={biografia}
                  onChange={(e) => setBiografia(e.target.value)}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Foto de Perfil (para DNI)</label>
                {!photoUploaded ? (
                    <button
                    type="button"
                    onClick={handleSimulateUpload}
                    disabled={loading}
                    className="w-full p-6 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                    >
                    <UploadCloud className="w-8 h-8 mb-2" />
                    <span className="text-sm font-bold">Subir una foto</span>
                    <span className="text-xs">Esto es una simulación</span>
                    </button>
                ) : (
                    <div className="p-3 border-2 border-emerald-200 bg-emerald-50 rounded-lg flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        <div>
                            <p className="font-bold text-sm text-emerald-800">Foto cargada</p>
                            <p className="text-xs text-emerald-600 truncate">{fotoUrl}</p>
                        </div>
                    </div>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || dniNumber.length !== 8 || !biografia || !fotoUrl}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && step === "dni" ? <Loader className="w-5 h-5 animate-spin" /> : null}
                {loading && step === "dni" ? "Validando..." : "Validar y Continuar"}
              </button>
            </form>
          )}

          {step === "background" && (
             <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-bold text-slate-800 mb-2">Verificación de Antecedentes</h3>
                <p className="text-sm text-slate-600">Estamos validando tu historial. Este proceso toma un momento.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm text-slate-700">DNI, Biografía y Foto Verificados</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Loader className="w-5 h-5 text-indigo-600 animate-spin" />
                  <span className="text-sm text-slate-700">Antecedentes Penales</span>
                </div>
              </div>

              <button
                onClick={handleBackgroundCheck}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : null}
                {loading ? "Verificando..." : "Finalizar Verificación"}
              </button>
            </div>
          )}

          {step === "success" && (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Verificación Completada</h3>
                <p className="text-sm text-slate-600">
                  Tu identidad ha sido verificada. Ahora puedes trabajar como profesional en ProxHogar.
                </p>
              </div>
              <button
                onClick={() =>
                  onSuccess({
                    biografia,
                    fotoBiometricaReferenciaUrl: fotoUrl,
                    dni: dniNumber,
                    antecedentesPenalesVerificados,
                  })
                }
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700"
              >
                Comenzar como Profesional
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
