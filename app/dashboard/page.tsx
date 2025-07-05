"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Flame, Trophy, Target, Calendar } from "lucide-react"
import { XPBar } from "@/components/xp-bar"
import { QuestCard } from "@/components/quest-card"
import { useAuth } from "@/hooks/use-auth"
import { getUserQuests, getQuestSubmissions } from "@/lib/supabase-functions"
import { Skeleton } from "@/components/ui/skeleton"
import AppShell from "@/components/app-shell"
import { TonWalletConnect } from "@/components/ton-wallet-connect"
import { WalletStatus } from "@/components/wallet-status"
import { TonConnectButton } from '@tonconnect/ui-react';

function Dashboard() {
  const { user, profile, loading: authLoading } = useAuth()
  const [userQuests, setUserQuests] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) {
      loadDashboardData()
    }
  }, [profile])

  const loadDashboardData = async () => {
    if (!profile || !profile.id || !/^[0-9a-fA-F-]{36}$/.test(profile.id)) {
      console.warn('Dashboard: Invalid or missing profile.id', profile?.id)
      setUserQuests([])
      setRecentActivity([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Load user quests
      const quests = (await getUserQuests(profile.id)) as any[]
      const activeQuests = quests
        .filter((q: any) => q.submission_status === "not_started" || q.submission_status === "pending")
        .slice(0, 3)
      setUserQuests(activeQuests)

      // Load recent activity (quest submissions)
      const submissions = await getQuestSubmissions(profile.id)
      setRecentActivity(submissions.slice(0, 3))
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 w-full max-w-full">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-slate-400">Please try signing in again.</p>
        </div>
      </div>
    )
  }

  if (!profile.wallet_address) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Connect Your TON Wallet</h2>
          <p className="text-slate-400 mb-4">To complete your profile, please connect your TON wallet.</p>
          <TonWalletConnect variant="outline" size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 w-full max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-400 text-sm md:text-base">Welcome back, @{profile.github_username}!</p>
          <WalletStatus />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" className="border-slate-700 bg-transparent text-xs md:text-sm">
            <Github className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="truncate">GitHub Connected</span>
          </Button>
          <TonWalletConnect variant="outline" size="sm" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="glass-card">
          <CardHeader className="pb-2 p-3 md:p-4">
            <CardTitle className="text-xs md:text-sm font-medium text-slate-400">Total XP</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <div className="text-lg md:text-2xl font-bold text-blue-400">{profile.xp.toLocaleString()}</div>
            <p className="text-xs text-slate-500">Level {Math.floor(profile.xp / 200)}</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2 p-3 md:p-4">
            <CardTitle className="text-xs md:text-sm font-medium text-slate-400">Current Streak</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <div className="flex items-center gap-1 md:gap-2">
              <Flame className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
              <span className="text-lg md:text-2xl font-bold text-orange-400">{profile.streak}</span>
              <span className="text-xs md:text-sm text-slate-500">days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2 p-3 md:p-4">
            <CardTitle className="text-xs md:text-sm font-medium text-slate-400">Quests Completed</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <div className="flex items-center gap-1 md:gap-2">
              <Target className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
              <span className="text-lg md:text-2xl font-bold text-green-400">
                {recentActivity.filter((a) => a.status === "approved").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2 p-3 md:p-4">
            <CardTitle className="text-xs md:text-sm font-medium text-slate-400">NFT Badges</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 pt-0">
            <div className="flex items-center gap-1 md:gap-2">
              <Trophy className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
              <span className="text-lg md:text-2xl font-bold text-purple-400">
                {recentActivity.filter((a) => a.status === "approved" && a.quests?.reward_type === "nft").length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* XP Progress */}
      <Card className="glass-card">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Trophy className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          <XPBar currentXP={profile.xp} level={Math.floor(profile.xp / 200)} />
        </CardContent>
      </Card>

      {/* Active Quests */}
      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <div className="min-w-0">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
            Active Quests
          </h2>
          <div className="space-y-3 md:space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)
            ) : userQuests.length > 0 ? (
              userQuests.map((quest) => (
                <QuestCard
                  key={quest.quest_id}
                  quest={{
                    id: quest.quest_id,
                    title: quest.title,
                    description: quest.description,
                    xpReward: quest.reward_xp,
                    status: quest.submission_status === "pending" ? "in_progress" : "available",
                    progress: quest.submission_status === "pending" ? 50 : 0,
                  }}
                />
              ))
            ) : (
              <Card className="glass-card">
                <CardContent className="p-4 text-center">
                  <p className="text-slate-400">No active quests. Check out the Quest Explorer!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
            Recent Activity
          </h2>
          <Card className="glass-card">
            <CardContent className="p-3 md:p-4">
              <div className="space-y-3 md:space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 md:p-3 rounded-lg bg-slate-800/50">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          activity.status === "approved"
                            ? "bg-green-400"
                            : activity.status === "pending"
                              ? "bg-yellow-400"
                              : "bg-red-400"
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium truncate">
                          {activity.status === "approved" ? "Completed" : "Submitted"} "{activity.quests?.title}"
                        </p>
                        <p className="text-xs text-slate-400">
                          {activity.status === "approved" && `+${activity.quests?.reward_xp} XP • `}
                          {new Date(activity.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return <AppShell><Dashboard /></AppShell>
}

export function TestWallet() {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, zIndex: 99999 }}>
      <TonConnectButton />
    </div>
  );
}
