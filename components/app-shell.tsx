"use client"

import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AppSidebar } from "@/components/app-sidebar"
import React from "react"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, profile } = useAuth()
  const isLanding = pathname === "/"
  const isConnected = user && profile && profile.github_username

  if (isLanding || !isConnected) {
    return <div className="w-full min-h-screen">{children}</div>
  }

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 w-full min-w-0 overflow-auto">
        <div className="w-full max-w-full min-h-screen">{children}</div>
      </main>
    </div>
  )
} 