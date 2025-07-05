import { supabase } from "./supabase"
import type { User, Quest } from "./supabase"

// User functions
export async function getUserProfile(githubUsername: string) {
  const { data, error } = await supabase.rpc("get_user_profile", { username: githubUsername }).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}

export async function createUser(userData: {
  github_username: string
  wallet_address?: string
  avatar_url?: string
}) {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error("No authenticated user found for profile creation.")
  }
  console.log('Creating user with UID:', user.id, userData)
  const { data, error } = await supabase.from("users").insert([
    {
      id: user.id,
      ...userData,
    },
  ]).select().single()

  if (error) {
    console.error("Error creating user:", error)
    throw error
  }

  return data
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

  if (error) {
    console.error("Error updating user profile:", error)
    throw error
  }

  return data
}

// Quest functions
export async function getAllQuests() {
  const { data, error } = await supabase
    .from("quests")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching quests:", error)
    return []
  }

  return data as Quest[]
}

export async function getUserQuests(userId: string): Promise<any[]> {
  // Validate userId is a non-empty UUID
  if (!userId || !/^[0-9a-fA-F-]{36}$/.test(userId)) {
    console.error('getUserQuests: Invalid or missing userId', userId);
    throw new Error('Invalid or missing userId for getUserQuests');
  }
  const { data, error } = await supabase.rpc("get_user_quests", { user_uuid: userId })

  if (error) {
    console.error("Error fetching user quests:", error)
    return []
  }

  // The get_user_quests RPC returns a custom shape, not Quest[]
  return data as any[]
}

export async function submitQuestProof(userId: string, questId: string, proof: string) {
  const { data, error } = await supabase.rpc("submit_quest_proof", {
    user_uuid: userId,
    quest_uuid: questId,
    proof_text: proof,
  })

  if (error) {
    console.error("Error submitting quest proof:", error)
    throw error
  }

  return data
}

export async function getQuestSubmissions(userId: string) {
  const { data, error } = await supabase
    .from("quest_submissions")
    .select(`
      *,
      quests (
        title,
        description,
        reward_xp,
        reward_type
      )
    `)
    .eq("user_id", userId)
    .order("submitted_at", { ascending: false })

  if (error) {
    console.error("Error fetching quest submissions:", error)
    return []
  }

  return data
}

// Gift functions
export async function sendGift(giftData: {
  sender_id: string
  receiver_id: string
  gift_type: "ton" | "jetton" | "nft"
  amount?: number
  nft_slug?: string
  message?: string
  tx_hash?: string
}) {
  const { data, error } = await supabase.from("gifts").insert([giftData]).select().single()

  if (error) {
    console.error("Error sending gift:", error)
    throw error
  }

  return data
}

export async function getUserGifts(userId: string) {
  const { data, error } = await supabase.rpc("get_user_gifts", { user_uuid: userId })

  if (error) {
    console.error("Error fetching user gifts:", error)
    return []
  }

  return data
}

// NFT functions
export async function getUserNFTs(userId: string) {
  const { data, error } = await supabase
    .from("nft_mints")
    .select(`
      *,
      quests (
        title,
        nft_slug
      )
    `)
    .eq("user_id", userId)
    .order("minted_at", { ascending: false })

  if (error) {
    console.error("Error fetching user NFTs:", error)
    return []
  }

  return data
}

export async function mintNFTBadge(userId: string, questId: string, nftSlug: string, txHash?: string) {
  const { data, error } = await supabase.rpc("mint_nft_badge", {
    user_uuid: userId,
    quest_uuid: questId,
    nft_slug_param: nftSlug,
    tx_hash_param: txHash,
  })

  if (error) {
    console.error("Error minting NFT badge:", error)
    throw error
  }

  return data
}

// Leaderboard functions
export async function getLeaderboard(limit = 10) {
  const { data, error } = await supabase.rpc("get_leaderboard", { limit_count: limit })

  if (error) {
    console.error("Error fetching leaderboard:", error)
    return []
  }

  return data
}

// XP functions
export async function updateUserXP(userId: string, xpAmount: number) {
  const { error } = await supabase.rpc("update_user_xp", {
    user_uuid: userId,
    xp_amount: xpAmount,
  })

  if (error) {
    console.error("Error updating user XP:", error)
    throw error
  }
}

// Authentication functions
export async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  })

  if (error) {
    console.error("Error signing in with GitHub:", error)
    throw error
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error("Error getting current user:", error)
    return null
  }

  return user
}
