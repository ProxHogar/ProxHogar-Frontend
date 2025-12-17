"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Home, Loader } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { apiCall } from "@/lib/api"
import { Button } from "@/components/ui/button"

export function AuthView() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")
  const router = useRouter()

  const [isRegister, setIsRegister] = useState(mode === "register")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombreCompleto: "",
    telefono: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()

  useEffect(() => {
    setIsRegister(mode === "register")
  }, [mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isRegister) {
        await apiCall({
          endpoint: "/auth/registro",
          method: "POST",
          body: {
            ...formData,
            fcmToken: "web_client", // As in user's file
          },
        })
        alert("¡Cuenta creada! Ahora inicia sesión.")
        setIsRegister(false) // Switch to login view
        // Clear form for login
        setFormData({ ...formData, password: "", nombreCompleto: "", telefono: "" })
      } else {
        const data = await apiCall({
          endpoint: "/auth/login",
          method: "POST",
          body: {
            email: formData.email,
            password: formData.password,
          },
        })
        login(data)
        router.push("/dashboard") // Redirect to dashboard
      }
    } catch (err: any) {
      setError(isRegister ? "Error al registrarse. Verifique datos." : "Credenciales inválidas.")
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsRegister(!isRegister)
    setError("")
    // Update URL without reloading the page
    const newMode = !isRegister ? "register" : "login"
    router.push(`/auth?mode=${newMode}`, { scroll: false })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
            <Home className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">ProxHogar</h1>
          <p className="text-slate-400 text-sm mt-2">
            {isRegister ? "Crea tu cuenta gratis" : "Accede a tu panel de control"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-900/50 border border-white/10 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  value={formData.nombreCompleto}
                  onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                  placeholder="Juan Pérez"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Teléfono</label>
                <input
                  type="tel"
                  required
                  className="w-full bg-slate-900/50 border border-white/10 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="999 000 000"
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-slate-900/50 border border-white/10 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="usuario@proxhogar.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Contraseña</label>
            <input
              type="password"
              required
              className="w-full bg-slate-900/50 border border-white/10 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="animate-spin w-5 h-5" /> : isRegister ? "Registrarse" : "Entrar ahora"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-6">
          {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
          <button
            onClick={toggleMode}
            className="text-indigo-400 hover:text-indigo-300 transition-colors ml-1 font-bold"
          >
            {isRegister ? "Inicia Sesión" : "Crear cuenta nueva"}
          </button>
        </p>
      </div>
    </div>
  )
}
