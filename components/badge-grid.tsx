import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"

interface NFTBadge {
  id: number
  name: string
  image: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface BadgeGridProps {
  badges: NFTBadge[]
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      case "rare":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "epic":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "legendary":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "rare":
        return "hover:shadow-blue-500/30"
      case "epic":
        return "hover:shadow-purple-500/30"
      case "legendary":
        return "hover:shadow-yellow-500/30"
      default:
        return "hover:shadow-gray-500/30"
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map((badge) => (
        <Card
          key={badge.id}
          className={`glass-card hover:scale-105 transition-all duration-300 cursor-pointer ${getRarityGlow(badge.rarity)}`}
        >
          <CardContent className="p-4 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-slate-800 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-medium text-sm mb-2">{badge.name}</h3>
            <Badge className={`text-xs ${getRarityColor(badge.rarity)}`}>{badge.rarity}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
