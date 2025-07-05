import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Lock, Play, CheckCircle } from "lucide-react"

interface Quest {
  id: number
  title: string
  description: string
  xpReward: number
  status: "available" | "in_progress" | "completed" | "locked"
  progress: number
}

interface QuestCardProps {
  quest: Quest
}

export function QuestCard({ quest }: QuestCardProps) {
  const getStatusIcon = () => {
    switch (quest.status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "in_progress":
        return <Play className="w-4 h-4 text-blue-400" />
      case "locked":
        return <Lock className="w-4 h-4 text-slate-500" />
      default:
        return <Trophy className="w-4 h-4 text-cyan-400" />
    }
  }

  const getStatusColor = () => {
    switch (quest.status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "in_progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "locked":
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
      default:
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
    }
  }

  const getButtonText = () => {
    switch (quest.status) {
      case "completed":
        return "Completed"
      case "in_progress":
        return "Continue"
      case "locked":
        return "Locked"
      default:
        return "Start Quest"
    }
  }

  return (
    <Card className="glass-card hover:glow-blue transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle className="text-lg">{quest.title}</CardTitle>
          </div>
          <Badge className={getStatusColor()}>{quest.xpReward} XP</Badge>
        </div>
        <CardDescription className="text-slate-400">{quest.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {quest.status === "in_progress" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Progress</span>
              <span className="text-slate-400">{quest.progress}%</span>
            </div>
            <Progress value={quest.progress} className="h-2 bg-slate-800" />
          </div>
        )}
        <Button
          className="w-full"
          disabled={quest.status === "locked" || quest.status === "completed"}
          variant={quest.status === "completed" ? "secondary" : "default"}
        >
          {getButtonText()}
        </Button>
      </CardContent>
    </Card>
  )
}
