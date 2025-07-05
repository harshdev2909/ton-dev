import { createClient } from "@supabase/supabase-js"

/*
  We export two helpers so we never expose the Service-Role key in the browser,
  but can still use it from Server Actions / Route Handlers.
*/

const PUBLIC_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ""
const PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ""

type SupabaseLike = ReturnType<typeof createClient>

function makeStub(): SupabaseLike {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const warn = () => console.warn("🔸 Supabase call ignored because env vars are not set in the preview sandbox.")
  const handler = {
    get() {
      return warn
    },
  }
  return new Proxy({} as any, handler)
}

/** Browser-safe client (uses anon key only) or stub if env vars are missing */
export const supabase: SupabaseLike = PUBLIC_URL && PUBLIC_KEY ? createClient(PUBLIC_URL, PUBLIC_KEY) : makeStub()

if (!PUBLIC_URL || !PUBLIC_KEY) {
  console.warn(
    "Supabase env variables are not defined. The app will run with a stub client in preview.\n" +
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY for full functionality.",
  )
}

/** Helper for server-only code (Service-Role key never sent to browser) */
export function createAdminSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set in the server environment.")
  }

  return createClient(PUBLIC_URL, serviceKey, { auth: { persistSession: false } })
}

// Types for our database
export interface User {
  id: string
  github_username: string
  wallet_address?: string
  xp: number
  streak: number
  joined_at: string
  avatar_url?: string
  last_active: string
}

export interface Quest {
  id: string
  title: string
  description: string
  reward_xp: number
  reward_type: "nft" | "jetton" | "xp_only"
  nft_slug?: string
  proof_type: "tx_hash" | "pr_url" | "manual_input"
  category: string
  difficulty: string
  is_active: boolean
  created_at: string
}

export interface QuestSubmission {
  id: string
  user_id: string
  quest_id: string
  proof: string
  status: "pending" | "approved" | "rejected"
  submitted_at: string
  reviewed_at?: string
  reviewer_notes?: string
}

export interface Gift {
  id: string
  sender_id: string
  receiver_id: string
  gift_type: "ton" | "jetton" | "nft"
  amount?: number
  nft_slug?: string
  message?: string
  tx_hash?: string
  status: string
  created_at: string
}

export interface NFTMint {
  id: string
  user_id: string
  quest_id?: string
  nft_slug: string
  tx_hash?: string
  metadata?: any
  minted_at: string
}
