"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { getUserProfile, createUser } from "@/lib/supabase-functions"
import type { User } from "@/lib/supabase"

interface AuthContextType {
  user: SupabaseUser | null
  profile: User | null
  loading: boolean
  signInWithGitHub: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Helper to load user profile from Supabase or create if missing
  const loadUserProfile = async (authUser: SupabaseUser) => {
    try {
      const githubUsername = authUser.user_metadata?.user_name || authUser.user_metadata?.preferred_username
      console.log('GitHub username for profile:', githubUsername)
      if (!githubUsername) {
        setProfile(null)
        setLoading(false)
        return
      }
      let userProfile: any = await getUserProfile(githubUsername)
      console.log('userProfile from getUserProfile:', userProfile)
      if (!userProfile) {
        // Always get the current user's UID for the id field
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("No authenticated user found for profile creation.")
        try {
          userProfile = await createUser({
            github_username: githubUsername,
            avatar_url: authUser.user_metadata?.avatar_url,
          })
        } catch (e: any) {
          // If duplicate error, fetch again
          if (e?.code === "23505" || (e?.message && e.message.includes("duplicate key"))) {
            userProfile = await getUserProfile(githubUsername)
          } else {
            throw e
          }
        }
      }
      // Type guard for User
      function isUser(obj: any): obj is User {
        return obj && typeof obj.id === 'string' && typeof obj.github_username === 'string';
      }
      if (!userProfile || !isUser(userProfile)) {
        setProfile(null)
      } else {
        setProfile(userProfile)
      }
      return; // Prevent further setProfile calls below
    } catch (error) {
      setProfile(null)
      console.error("Error loading user profile:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false
    setLoading(true)
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (ignore) return
      setUser(session?.user ?? null)
      if (session?.user) {
        setLoading(true)
        await loadUserProfile(session.user)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (ignore) return
      setUser(session?.user ?? null)
      if (session?.user) {
        setLoading(true)
        await loadUserProfile(session.user)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })
    return () => { ignore = true; subscription.unsubscribe() }
  }, [])

  const signInWithGitHub = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) {
      setLoading(false)
      console.error("Error signing in:", error)
      throw error
    }
  }

  const signOut = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      setLoading(false)
      console.error("Error signing out:", error)
      throw error
    }
    setUser(null)
    setProfile(null)
    setLoading(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGitHub,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
