"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Camera, CheckCircle, AlertCircle, Loader } from "lucide-react"
import { Button } from "@/components/ui/custom-button"
import { Card } from "@/components/ui/custom-card"

interface FaceIDVerificationProps {
  workerId: number
  jobId: number
  onVerificationSuccess: () => void
  onClose: () => void
}

export const FaceIDVerification: React.FC<FaceIDVerificationProps> = ({
  workerId,
  jobId,
  onVerificationSuccess,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [step, setStep] = useState<"camera" | "capture" | "processing" | "success" | "error">("camera")
  const [cameraActive, setCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [verificationMessage, setVerificationMessage] = useState("")

  // Inicializar cámara
  useEffect(() => {
    if (step === "camera") {
      startCamera()
    }
    return () => {
      stopCamera()
    }
  }, [step])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error("Error al acceder a cámara:", err)
      setStep("error")
      setVerificationMessage("No se puede acceder a la cámara. Verifica los permisos.")
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setCameraActive(false)
    }
  }

  // Capturar foto del rostro
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        const imageData = canvasRef.current.toDataURL("image/jpeg")
        setCapturedImage(imageData)
        setStep("processing")
        stopCamera()
        simulateFaceIDVerification()
      }
    }
  }

  // Simular verificación de Face ID (en producción, enviarías a backend con API de face recognition)
  const simulateFaceIDVerification = async () => {
    try {
      // Simular delay de procesamiento
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simular respuesta aleatoria (90% éxito, 10% error)
      const isSuccessful = Math.random() > 0.1
      if (isSuccessful) {
        setStep("success")
        setVerificationMessage("Identidad verificada exitosamente")
        setTimeout(() => {
          onVerificationSuccess()
        }, 2000)
      } else {
        setStep("error")
        setVerificationMessage("No se pudo verificar la identidad. Intenta de nuevo.")
      }
    } catch (err) {
      console.error("Error en verificación:", err)
      setStep("error")
      setVerificationMessage("Error en la verificación. Intenta de nuevo.")
    }
  }

  // Reintentar captura
  const retryCapture = () => {
    setCapturedImage(null)
    setStep("camera")
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">Verificación de Identidad</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        {step === "camera" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Posiciona tu rostro frente a la cámara para verificar tu identidad antes de comenzar el trabajo.
            </p>
            <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-40 h-48 border-2 border-emerald-400 rounded-2xl opacity-50" />
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={capturePhoto} className="flex-1 gap-2">
                <Camera className="w-4 h-4" />
                Capturar Foto
              </Button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="space-y-4 text-center py-8">
            <div className="flex justify-center">
              <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
            <p className="text-sm text-slate-600">Verificando tu identidad...</p>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {step === "success" && (
          <div className="space-y-4 text-center py-8">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            </div>
            <p className="font-bold text-slate-800">Identidad Verificada</p>
            <p className="text-sm text-slate-600">Puedes comenzar tu trabajo. ¡Buena suerte!</p>
          </div>
        )}

        {step === "error" && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
              <p className="font-bold text-slate-800 mb-2">Error de Verificación</p>
              <p className="text-sm text-slate-600">{verificationMessage}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={retryCapture} className="flex-1 gap-2">
                Reintentar
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
