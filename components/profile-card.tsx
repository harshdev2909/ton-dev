import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, Wallet, Trophy } from "lucide-react"

interface ProfileCardProps {
  user: {
    name: string
    githubHandle: string
    walletAddress: string
    avatar: string
    xp: number
    level: number
    questsCompleted: number
    nftBadges: number
  }
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <Card className="glass-card">
      <CardHeader className="text-center">
        <Avatar className="w-20 h-20 mx-auto mb-4 ring-2 ring-blue-500/30">
          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback className="bg-slate-800 text-xl">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl">{user.name}</CardTitle>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <Github className="w-4 h-4" />
            {user.githubHandle}
          </div>
          <div className="flex items-center gap-1">
            <Wallet className="w-4 h-4" />
            {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{user.xp.toLocaleString()}</div>
            <div className="text-xs text-slate-400">XP (Level {user.level})</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{user.questsCompleted}</div>
            <div className="text-xs text-slate-400">Quests</div>
          </div>
        </div>
        <div className="flex justify-center">
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Trophy className="w-3 h-3 mr-1" />
            {user.nftBadges} NFT Badges
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
