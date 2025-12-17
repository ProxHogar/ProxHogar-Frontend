"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { apiCall } from "@/lib/api"
import { Button } from "@/components/ui/custom-button"
import { Shield, Star, MessageSquare, Loader } from "lucide-react"

export const MyProfileView = () => {
  const { user, activeRole } = useAuth()

  const [myProfile, setMyProfile] = useState<any>(null)
  const [myReviews, setMyReviews] = useState<any[]>([])
  const [loadingProfile, setLoadingProfile] = useState(true)

  useEffect(() => {
    if (user?.usuarioId && user.esTrabajador) {
      setLoadingProfile(true)
      Promise.all([
        apiCall({ endpoint: `/trabajadores/usuario/${user.usuarioId}` }),
        apiCall({ endpoint: `/resenas/usuario/${user.usuarioId}` }),
      ])
        .then(([profileData, reviewsData]) => {
          setMyProfile(profileData)
          setMyReviews(reviewsData)
        })
        .catch((err) => console.error("Error fetching worker profile:", err))
        .finally(() => setLoadingProfile(false))
    } else {
      setLoadingProfile(false)
    }
  }, [user])

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600" />
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 bg-white p-1 rounded-full shadow-lg">
              <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-3xl font-bold text-slate-500">
                {user?.nombreCompleto?.charAt(0)}
              </div>
            </div>
            <Button variant="secondary">Editar Perfil</Button>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800">{user?.nombreCompleto}</h2>
            <p className="text-slate-500">{user?.email}</p>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded font-bold">{activeRole}</span>
              {user?.esTrabajador && myProfile?.verificado && (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded font-bold flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Verificado
                </span>
              )}
            </div>
          </div>

          {user?.esTrabajador && (
            <div className="mt-8 pt-8 border-t border-slate-100">
              {loadingProfile ? (
                <div className="text-center py-4">
                  <Loader className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
                </div>
              ) : myProfile ? (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-bold text-lg mb-4">Estadísticas de Trabajador</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase font-bold">Calificación</p>
                        <p className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-400" />
                          {myProfile.calificacionPromedio?.toFixed(1) || "N/A"}
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase font-bold">Trabajos Completados</p>
                        <p className="text-2xl font-bold text-emerald-600">{myProfile.trabajosCompletados || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-4">Biografía</h4>
                    <p className="text-slate-700 bg-slate-50 p-4 rounded-xl text-sm leading-relaxed">
                      {myProfile.biografia || "No has establecido una biografía todavía."}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" /> Comentarios Recibidos ({myReviews.length})
                    </h4>
                    {myReviews.length === 0 ? (
                      <p className="text-slate-500 text-sm italic">Aún no tienes reseñas.</p>
                    ) : (
                      <div className="space-y-4">
                        {myReviews.map((rev: any) => (
                          <div key={rev.id} className="border-b border-slate-100 pb-3 last:border-0">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-sm text-slate-800">{rev.autor.nombreCompleto}</span>
                              <span className="text-xs text-slate-400">
                                {new Date(rev.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex text-yellow-400 mb-1">
                              {[...Array(rev.calificacion)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                            <p className="text-sm text-slate-600">"{rev.comentario}"</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No se pudo cargar tu perfil de trabajador.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
