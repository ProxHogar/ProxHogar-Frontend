"use client"

import { useState } from "react"
import { Home as HomeIcon, Menu, X, ArrowRight, Users, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: Users,
      title: "Conecta con profesionales",
      description: "Encuentra los mejores trabajadores verificados para cualquier servicio del hogar",
    },
    {
      icon: Zap,
      title: "Rápido y confiable",
      description: "Solicita un servicio y recibe ofertas en minutos de profesionales cerca de ti",
    },
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Pagos protegidos, perfiles verificados y garantía de satisfacción en cada trabajo",
    },
  ]

  const stats = [
    { label: "Usuarios Activos", value: "2,500+" },
    { label: "Trabajos Completados", value: "15,000+" },
    { label: "Calificación Promedio", value: "4.9★" },
  ]

  return (
    <div className="min-h-screen bg-slate-950 relative">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] bg-purple-500 rounded-full blur-3xl opacity-15 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-cyan-500 rounded-full blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-lg group-hover:shadow-indigo-500/50 transition-all">
              <HomeIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">ProxHogar</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-400 hover:text-indigo-300 font-medium transition-colors">
              Características
            </a>
            <a href="#stats" className="text-slate-400 hover:text-indigo-300 font-medium transition-colors">
              Nosotros
            </a>
            <a href="#cta" className="text-slate-400 hover:text-indigo-300 font-medium transition-colors">
              Preguntas
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth?mode=login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/auth?mode=register">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-600/30 border border-indigo-400/20">
                Registrarse
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-slate-950/90 backdrop-blur animate-in fade-in slide-in-from-top-2">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                className="block px-4 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Características
              </a>
              <a
                href="#stats"
                className="block px-4 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Nosotros
              </a>
              <a
                href="#cta"
                className="block px-4 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Preguntas
              </a>
              <div className="pt-3 border-t border-white/5 space-y-2">
                <Link href="/auth?mode=login" className="block">
                  <Button variant="ghost" className="w-full text-slate-300 hover:text-white">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/auth?mode=register" className="block">
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                    Registrarse
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-block mb-6 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full backdrop-blur">
            <span className="text-sm font-semibold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Bienvenido a ProxHogar
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight text-balance leading-tight">
            Encuentra el{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
              mejor profesional
            </span>{" "}
            para tu hogar
          </h1>

          {/* Subheading */}
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto text-balance leading-relaxed">
            Conecta con trabajadores verificados, obtén presupuestos al instante y completa tus proyectos de manera
            segura y confiable.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth?mode=register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-2xl shadow-indigo-600/40 transform hover:scale-105 transition-all border border-indigo-400/20"
              >
                Empezar Ahora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-600 text-white hover:bg-white/5 hover:border-indigo-400 bg-transparent transition-all"
              >
                Conocer Más
              </Button>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-white/10">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 text-balance">Por qué elegir ProxHogar</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Te ofrecemos la mejor plataforma para conectar con profesionales confiables
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div
                  key={idx}
                  className="group p-8 rounded-2xl border border-white/10 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-600/20 transition-all duration-300 bg-gradient-to-br from-slate-900/50 to-slate-800/30 hover:from-slate-900/80 hover:to-slate-800/50 backdrop-blur"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl flex items-center justify-center mb-4 group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:border-indigo-400 transition-all">
                    <Icon className="w-7 h-7 text-indigo-300 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="stats" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Funciona en 3 simples pasos</h2>
            <p className="text-lg text-slate-400">Desde solicitud hasta ejecución del trabajo</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Describe tu solicitud",
                desc: "Cuéntanos qué servicio necesitas y dónde lo necesitas",
              },
              { step: 2, title: "Recibe ofertas", desc: "Profesionales verificados te harán sus mejores propuestas" },
              {
                step: 3,
                title: "Elige y contrata",
                desc: "Selecciona al profesional y completa el trabajo con confianza",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gradient-to-br from-slate-900/70 to-slate-800/40 border border-white/10 rounded-2xl p-8 text-center hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-600/20 transition-all backdrop-blur">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 shadow-lg shadow-indigo-600/40">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 transform -translate-y-1/2">
                    <ArrowRight className="w-4 h-4 text-indigo-400 absolute -right-5 top-1/2 transform -translate-y-1/2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-3xl blur-xl opacity-50"></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-slate-950 to-slate-950 rounded-3xl"></div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 text-balance">¿Listo para comenzar?</h2>
          <p className="text-lg text-slate-300 mb-8 text-balance">
            Únete a miles de usuarios que ya confían en ProxHogar para sus servicios del hogar
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?mode=register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-2xl shadow-indigo-600/40 border border-indigo-400/20 hover:shadow-2xl transform hover:scale-105 transition-all"
              >
                Crear mi cuenta
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth?mode=login">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-indigo-500/40 text-white hover:bg-indigo-600/10 hover:border-indigo-400 bg-transparent backdrop-blur"
              >
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-white/5 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <HomeIcon className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">ProxHogar</span>
              </div>
              <p className="text-sm text-slate-500">Tu plataforma de confianza para servicios del hogar</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">
                    Precios
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">
                    Sobre nosotros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">
                    Términos
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 text-center text-sm text-slate-500">
            <p>&copy; 2025 ProxHogar. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
