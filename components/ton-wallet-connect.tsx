"use client"

import { useEffect } from "react"
import { TonConnectButton } from '@tonconnect/ui-react'
import { useAuth } from "@/hooks/use-auth"
import { updateUserProfile } from "@/lib/supabase-functions"
import { useToast } from "@/hooks/use-toast"
import { useTonWallet } from '@tonconnect/ui-react'

export function TonWalletConnect({ variant = "default", size = "default" }: { 
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}) {
  const { profile } = useAuth()
  const { toast } = useToast()
  const wallet = useTonWallet()

  useEffect(() => {
    // When wallet connects, update the user profile
    if (wallet && profile?.id) {
      handleWalletConnected(wallet.account.address)
    }
  }, [wallet, profile?.id])

  const handleWalletConnected = async (address: string) => {
    if (profile && profile.id) {
      try {
        await updateUserProfile(profile.id, { wallet_address: address })
        toast({
          title: "Wallet Connected!",
          description: `TON wallet ${address.slice(0, 8)}...${address.slice(-6)} connected successfully.`,
        })
      } catch (error) {
        console.error("Error updating profile with wallet address:", error)
        toast({
          title: "Connection Error",
          description: "Wallet connected but failed to update profile.",
          variant: "destructive"
        })
      }
    }
  }

  // Use the official TonConnectButton with default styling for full interactivity
  return <TonConnectButton />
} 