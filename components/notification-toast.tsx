"use client"

import { useToast } from "@/hooks/use-toast"

export function useNotifications() {
  const { toast } = useToast()

  const showQuestCompleted = (questTitle: string, xpReward: number) => {
    toast({
      title: "Quest Completed! 🎉",
      description: `You completed "${questTitle}" and earned ${xpReward} XP!`,
      duration: 5000,
    })
  }

  const showGiftReceived = (giftType: string, amount: string, sender: string) => {
    toast({
      title: "Gift Received! 🎁",
      description: `You received ${amount} ${giftType} from ${sender}`,
      duration: 5000,
    })
  }

  const showLevelUp = (newLevel: number) => {
    toast({
      title: "Level Up! ⚡",
      description: `Congratulations! You've reached Level ${newLevel}!`,
      duration: 5000,
    })
  }

  const showBadgeEarned = (badgeName: string) => {
    toast({
      title: "NFT Badge Earned! 🏆",
      description: `You've earned the "${badgeName}" badge!`,
      duration: 5000,
    })
  }

  return {
    showQuestCompleted,
    showGiftReceived,
    showLevelUp,
    showBadgeEarned,
  }
}
