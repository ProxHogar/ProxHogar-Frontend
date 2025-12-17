// Use a wrapper component to leverage Suspense for search params
import { Suspense } from "react"
import { AuthView } from "@/components/auth/auth-view"

export default function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthView />
    </Suspense>
  )
}
