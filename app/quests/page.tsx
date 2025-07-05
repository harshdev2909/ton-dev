"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, Trophy, Play, Upload, CheckCircle } from "lucide-react"
import { QuestCard } from "@/components/quest-card"
import { useAuth } from "@/hooks/use-auth"
import { getAllQuests, getUserQuests, submitQuestProof } from "@/lib/supabase-functions"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import type { Quest } from "@/lib/supabase"

export default function QuestExplorer() {
  const { profile } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedQuest, setSelectedQuest] = useState<any>(null)
  const [allQuests, setAllQuests] = useState<Quest[]>([])
  const [userQuestStatus, setUserQuestStatus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [proofText, setProofText] = useState("")

  useEffect(() => {
    loadQuests()
  }, [profile])

  const loadQuests = async () => {
    try {
      setLoading(true)
      const quests = await getAllQuests()
      setAllQuests(quests)

      if (profile) {
        const userQuests = await getUserQuests(profile.id)
        setUserQuestStatus(userQuests)
      }
    } catch (error) {
      console.error("Error loading quests:", error)
      toast({
        title: "Error",
        description: "Failed to load quests. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitProof = async () => {
    if (!profile || !selectedQuest || !proofText.trim()) return

    try {
      setSubmitting(true)
      await submitQuestProof(profile.id, selectedQuest.id, proofText)

      toast({
        title: "Quest Submitted! 🎯",
        description: `Your proof for "${selectedQuest.title}" has been submitted for review.`,
      })

      setProofText("")
      setSelectedQuest(null)
      await loadQuests() // Refresh quest status
    } catch (error) {
      console.error("Error submitting quest proof:", error)
      toast({
        title: "Error",
        description: "Failed to submit quest proof. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getQuestStatus = (questId: string) => {
    const userQuest = userQuestStatus.find((uq) => uq.quest_id === questId)
    return userQuest?.submission_status || "available"
  }

  const getQuestProgress = (questId: string) => {
    const status = getQuestStatus(questId)
    return status === "pending" ? 50 : status === "approved" ? 100 : 0
  }

  const filteredQuests = allQuests.filter(
    (quest) =>
      quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const questsByCategory = {
    all: filteredQuests,
    beginner: filteredQuests.filter((q) => q.difficulty === "beginner"),
    intermediate: filteredQuests.filter((q) => q.difficulty === "intermediate"),
    advanced: filteredQuests.filter((q) => q.difficulty === "advanced"),
    community: filteredQuests.filter((q) => q.category === "community"),
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Quest Explorer</h1>
          <p className="text-slate-400 text-sm md:text-base">Discover and complete quests to earn XP and NFT badges</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search quests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700"
        />
      </div>

      {/* Quest Categories */}
      <Tabs defaultValue="all" className="space-y-4 md:space-y-6">
        <TabsList className="bg-slate-800/50">
          <TabsTrigger value="all">All Quests</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        {Object.entries(questsByCategory).map(([category, categoryQuests]) => (
          <TabsContent key={category} value={category}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {categoryQuests.map((quest) => {
                const status = getQuestStatus(quest.id)
                const progress = getQuestProgress(quest.id)

                return (
                  <Dialog key={quest.id}>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer">
                        <QuestCard
                          quest={{
                            id: quest.id,
                            title: quest.title,
                            description: quest.description,
                            xpReward: quest.reward_xp,
                            status:
                              status === "approved" ? "completed" : status === "pending" ? "in_progress" : "available",
                            progress,
                          }}
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                          <Trophy className="w-5 h-5 text-cyan-400" />
                          {quest.title}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">{quest.description}</DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        {/* Reward */}
                        <div className="flex items-center gap-2">
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                            {quest.reward_xp} XP Reward
                          </Badge>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {quest.difficulty}
                          </Badge>
                          {quest.reward_type === "nft" && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">NFT Badge</Badge>
                          )}
                        </div>

                        {/* Proof Type */}
                        <div>
                          <h4 className="font-semibold mb-2">Proof Required</h4>
                          <p className="text-sm text-slate-400">
                            {quest.proof_type === "tx_hash" && "Transaction hash from blockchain"}
                            {quest.proof_type === "pr_url" && "GitHub Pull Request URL"}
                            {quest.proof_type === "manual_input" && "Manual proof submission"}
                          </p>
                        </div>

                        {/* Status-based content */}
                        {status === "approved" && (
                          <div className="flex items-center gap-2 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-green-400 font-medium">Quest Completed!</span>
                          </div>
                        )}

                        {status === "pending" && (
                          <div className="flex items-center gap-2 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                            <Trophy className="w-5 h-5 text-yellow-400" />
                            <span className="text-yellow-400 font-medium">Submission Under Review</span>
                          </div>
                        )}

                        {/* Proof Submission */}
                        {profile && status === "available" && (
                          <div className="space-y-3">
                            <h4 className="font-semibold">Submit Proof</h4>
                            <Textarea
                              placeholder={
                                quest.proof_type === "tx_hash"
                                  ? "Enter transaction hash..."
                                  : quest.proof_type === "pr_url"
                                    ? "Enter GitHub PR URL..."
                                    : "Provide proof of completion..."
                              }
                              value={proofText}
                              onChange={(e) => setProofText(e.target.value)}
                              className="bg-slate-800/50 border-slate-700"
                            />
                            <Button
                              className="w-full"
                              onClick={handleSubmitProof}
                              disabled={!proofText.trim() || submitting}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {submitting ? "Submitting..." : "Submit for Review"}
                            </Button>
                          </div>
                        )}

                        {/* Action Button for non-authenticated users */}
                        {!profile && (
                          <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                            <p className="text-slate-400 mb-2">Connect your GitHub to start this quest</p>
                            <Button variant="outline" disabled>
                              <Play className="w-4 h-4 mr-2" />
                              Connect GitHub First
                            </Button>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
