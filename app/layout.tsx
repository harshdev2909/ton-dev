import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/hooks/use-auth"
import { TonConnectProvider } from "@/components/ton-connect-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ForkTON.dev - TON Developer Quest Platform",
  description: "Track your TON development journey with GitHub integration, quests, and NFT rewards",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-white`}>
        <TonConnectProvider>
          <AuthProvider>
            <SidebarProvider>
              {children}
            </SidebarProvider>
            <Toaster />
          </AuthProvider>
        </TonConnectProvider>
      </body>
    </html>
  )
}
