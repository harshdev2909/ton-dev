import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Github, Wallet, Trophy, Target, Calendar, ExternalLink } from "lucide-react"
import { BadgeGrid } from "@/components/badge-grid"

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: "Alex Developer",
    githubHandle: "alexdev",
    walletAddress: "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
    avatar: "/placeholder.svg?height=120&width=120",
    xp: 2450,
    level: 12,
    questsCompleted: 23,
    nftBadges: 8,
    joinDate: "March 2024",
    streak: 7,
    totalContributions: 156,
  }

  const recentQuests = [
    { title: "Deploy First Smart Contract", completed: "2 days ago", xp: 500 },
    { title: "Contribute to Documentation", completed: "1 week ago", xp: 300 },
    { title: "Create NFT Collection", completed: "2 weeks ago", xp: 750 },
  ]

  const nftBadges = [
    { id: 1, name: "First Contract", image: "/placeholder.svg?height=100&width=100", rarity: "common" },
    { id: 2, name: "Documentation Hero", image: "/placeholder.svg?height=100&width=100", rarity: "rare" },
    { id: 3, name: "NFT Creator", image: "/placeholder.svg?height=100&width=100", rarity: "epic" },
    { id: 4, name: "Early Adopter", image: "/placeholder.svg?height=100&width=100", rarity: "legendary" },
    { id: 5, name: "Community Builder", image: "/placeholder.svg?height=100&width=100", rarity: "rare" },
    { id: 6, name: "Bug Hunter", image: "/placeholder.svg?height=100&width=100", rarity: "common" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Developer Profile</h1>
        <Button variant="outline" className="border-slate-700 bg-transparent">
          <ExternalLink className="w-4 h-4 mr-2" />
          Share Profile
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="glass-card">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-blue-500/30">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-slate-800 text-2xl">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <Github className="w-4 h-4" />
                  <span>@{user.githubHandle}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                  <Wallet className="w-4 h-4" />
                  <span>
                    {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-6)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">{user.xp.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">Total XP</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">{user.level}</div>
                  <div className="text-xs text-slate-400">Level</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-green-400">{user.questsCompleted}</div>
                  <div className="text-xs text-slate-400">Quests</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-400">{user.nftBadges}</div>
                  <div className="text-xs text-slate-400">NFT Badges</div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-700 space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {user.joinDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>{user.totalContributions} total contributions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Recent Quests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentQuests.map((quest, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div>
                    <p className="text-sm font-medium">{quest.title}</p>
                    <p className="text-xs text-slate-400">{quest.completed}</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">+{quest.xp} XP</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* NFT Badge Gallery */}
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-400" />
                NFT Badge Collection
              </CardTitle>
              <CardDescription>Showcase your achievements with these unique NFT badges</CardDescription>
            </CardHeader>
            <CardContent>
              <BadgeGrid badges={nftBadges} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
