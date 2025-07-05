"use client"

import { useTonAddress } from '@tonconnect/ui-react'
import { CheckCircle } from 'lucide-react'

export function WalletStatus() {
  const address = useTonAddress()

  if (!address) {
    return null
  }

  return (
    <div className="flex items-center gap-2 text-green-400 text-sm">
      <CheckCircle className="w-4 h-4" />
      <span className="font-mono">
        {address.slice(0, 6)}...{address.slice(-4)}
      </span>
    </div>
  )
} 