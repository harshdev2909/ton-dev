"use client"

import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { ReactNode } from 'react'

const manifestUrl = typeof window !== 'undefined' ? `${window.location.origin}/tonconnect-manifest.json` : '/tonconnect-manifest.json'

export function TonConnectProvider({ children }: { children: ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl="http://localhost:3000/tonconnect-manifest.json">
      {children}
    </TonConnectUIProvider>
  )
} 