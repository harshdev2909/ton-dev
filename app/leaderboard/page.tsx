"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Crown, Trophy, Target, Github, ExternalLink, Medal } from "lucide-react"
import { getLeaderboard } from "@/lib/supabase-functions"
import { Skeleton } from "@/components/ui/skeleton"

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      const data = await getLeaderboard(50) // Get top 50 users
      setLeaderboardData(data)
    } catch (error) {
      console.error("Error loading leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-slate-400 font-bold">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case 2:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
      case 3:
        return "bg-amber-600/20 text-amber-400 border-amber-600/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const sortedByXP = [...leaderboardData].sort((a, b) => b.xp - a.xp)
  const sortedByQuests = [...leaderboardData].sort((a, b) => b.quest_count - a.quest_count)
  const sortedByStreak = [...leaderboardData].sort((a, b) => b.streak - a.streak)
  const sortedByNFTs = [...leaderboardData].sort((a, b) => b.nft_count - a.nft_count)

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    )
  }

  const LeaderboardList = ({ data, sortKey, icon, color }: any) => (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          Top Developers by {sortKey}
        </CardTitle>
        <CardDescription>Developers ranked by {sortKey.toLowerCase()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.length > 0 ? (
            data.map((dev: any, index: number) => (
              <div
                key={dev.user_id}
                className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(index + 1)}
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={dev.avatar_url || "/placeholder.svg"} alt={dev.github_username} />
                    <AvatarFallback className="bg-slate-700">
                      {dev.github_username?.slice(0, 2).toUpperCase() || "UN"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{dev.github_username}</h3>
                    <Badge className={getRankBadge(index + 1)}>Rank #{index + 1}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Github className="w-3 h-3" />@{dev.github_username}
                    </span>
                    {dev.wallet_address && (
                      <span>
                        {dev.wallet_address.slice(0, 6)}...{dev.wallet_address.slice(-4)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-xl font-bold ${color}`}>
                    {sortKey === "XP" && dev.xp?.toLocaleString()}
                    {sortKey === "Quests" && dev.quest_count}
                    {sortKey === "Streak" && `${dev.streak} days`}
                    {sortKey === "NFT Badges" && dev.nft_count}
                  </div>
                  <div className="text-sm text-slate-400">
                    {sortKey === "XP" && `Level ${Math.floor(dev.xp / 200)}`}
                    {sortKey === "Quests" && "Completed"}
                    {sortKey === "Streak" && "Current"}
                    {sortKey === "NFT Badges" && "Collected"}
                  </div>
                </div>

                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400">No developers found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Leaderboard</h1>
          <p className="text-slate-400 text-sm md:text-base">Top developers in the TON ecosystem</p>
        </div>
        <Button variant="outline" className="border-slate-700 bg-transparent">
          <Trophy className="w-4 h-4 mr-2" />
          View My Rank
        </Button>
      </div>

      {/* Leaderboard Categories */}
      <Tabs defaultValue="xp" className="space-y-4 md:space-y-6">
        <TabsList className="bg-slate-800/50">
          <TabsTrigger value="xp">By XP</TabsTrigger>
          <TabsTrigger value="quests">By Quests</TabsTrigger>
          <TabsTrigger value="streak">By Streak</TabsTrigger>
          <TabsTrigger value="badges">By NFT Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="xp">
          <LeaderboardList
            data={sortedByXP.slice(0, 20)}
            sortKey="XP"
            icon={<Trophy className="w-5 h-5 text-blue-400" />}
            color="text-blue-400"
          />
        </TabsContent>

        <TabsContent value="quests">
          <LeaderboardList
            data={sortedByQuests.slice(0, 20)}
            sortKey="Quests"
            icon={<Target className="w-5 h-5 text-green-400" />}
            color="text-green-400"
          />
        </TabsContent>

        <TabsContent value="streak">
          <LeaderboardList
            data={sortedByStreak.slice(0, 20)}
            sortKey="Streak"
            icon={<Medal className="w-5 h-5 text-orange-400" />}
            color="text-orange-400"
          />
        </TabsContent>

        <TabsContent value="badges">
          <LeaderboardList
            data={sortedByNFTs.slice(0, 20)}
            sortKey="NFT Badges"
            icon={<Trophy className="w-5 h-5 text-purple-400" />}
            color="text-purple-400"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
