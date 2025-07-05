"use client"

import { Progress } from "@/components/ui/progress"

interface XPBarProps {
  currentXP: number
  level: number
}

export function XPBar({ currentXP, level }: XPBarProps) {
  // Calculate XP needed for current level and next level
  const currentLevelXP = level * 200 // Simple formula: level * 200
  const nextLevelXP = (level + 1) * 200
  const progressXP = currentXP - currentLevelXP
  const neededXP = nextLevelXP - currentLevelXP
  const progressPercentage = (progressXP / neededXP) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">Level {level}</span>
        <span className="text-slate-400">Level {level + 1}</span>
      </div>
      <Progress value={progressPercentage} className="h-3 bg-slate-800" />
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{progressXP} XP</span>
        <span>{neededXP - progressXP} XP to next level</span>
      </div>
    </div>
  )
}
