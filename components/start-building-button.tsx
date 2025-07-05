"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { getUserProfile, createUser } from "@/lib/supabase-functions"
import { useToast } from "@/hooks/use-toast"

function RedirectOverlay({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 text-white">
      <svg className="animate-spin h-10 w-10 mb-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <div className="text-2xl font-bold mb-2">Redirecting to GitHub...</div>
      <div className="text-slate-300">Please complete authentication and return.</div>
    </div>
  )
}

export default function StartBuildingButton() {
  const { signInWithGitHub, user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleStart = async () => {
    setError(null)
    setLoading(true)
    try {
      // 1. GitHub OAuth
      if (!user) {
        toast({ title: "Redirecting to GitHub...", description: "Please complete authentication and return." })
        await signInWithGitHub()
        return
      }
      // 2. Ensure profile exists
      let userProfile = profile
      if (!userProfile) {
        // Try to fetch profile by GitHub username
        const githubUsername = user.user_metadata?.user_name || user.user_metadata?.preferred_username
        if (!githubUsername) throw new Error("GitHub username not found.")
        const fetchedProfile = await getUserProfile(githubUsername)
        if (fetchedProfile) {
          userProfile = fetchedProfile as any
        } else {
          const createdProfile = await createUser({
            github_username: githubUsername,
            avatar_url: user.user_metadata?.avatar_url,
          })
          if (!createdProfile) throw new Error("Failed to create user profile.")
          userProfile = createdProfile as any
        }
      }
      // Ensure userProfile is not null
      if (!userProfile) throw new Error("User profile could not be loaded or created.")
      
      // 3. Redirect to dashboard (no wallet requirement)
      router.push("/dashboard")
    } catch (e: any) {
      setError(e.message || "Something went wrong.")
      setLoading(false)
    }
  }

  return (
    <>
      <RedirectOverlay show={loading} />
      <Button
        size="lg"
        className="bg-blue-600 hover:bg-blue-700 glow-blue w-full sm:w-auto"
        onClick={handleStart}
        disabled={loading}
      >
        <Github className="w-4 h-4 md:w-5 md:h-5 mr-2" />
        {loading ? "Connecting..." : "Start Building"}
        {error && <span className="text-red-500 ml-2 text-xs">{error}</span>}
      </Button>
    </>
  )
} 