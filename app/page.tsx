import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Trophy, Gift, Zap, Target } from "lucide-react"
import Link from "next/link"
import StartBuildingButton from "@/components/start-building-button"
import { TonWalletConnect } from "@/components/ton-wallet-connect"

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative px-4 md:px-6 py-12 md:py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-cyan-500/10" />
        <div className="relative max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <div className="inline-flex items-center px-3 md:px-4 py-2 rounded-full bg-slate-800/50 border border-blue-500/30 text-blue-400 text-xs md:text-sm mb-4 md:mb-6">
              <Zap className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              TON-Native Developer Platform
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight px-2">
            Track Your <span className="gradient-text">TON Dev</span> Journey
          </h1>

          <p className="text-base md:text-xl text-slate-400 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Connect your GitHub, complete quests, earn XP, and collect NFT badges while building on The Open Network
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <StartBuildingButton />
            <TonWalletConnect
              size="lg"
              variant="outline"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Level Up</span>
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto px-4">
              Gamify your development experience with quests, rewards, and community features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Card className="glass-card hover:glow-blue transition-all duration-300">
              <CardHeader className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                  <Target className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white text-lg md:text-xl">Quest System</CardTitle>
                <CardDescription className="text-slate-400 text-sm md:text-base">
                  Complete coding challenges and earn XP for your contributions to the TON ecosystem
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card hover:glow-cyan transition-all duration-300">
              <CardHeader className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                  <Trophy className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white text-lg md:text-xl">NFT Badges</CardTitle>
                <CardDescription className="text-slate-400 text-sm md:text-base">
                  Collect unique NFT badges for completing quests and showcase your achievements
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card hover:glow-blue transition-all duration-300">
              <CardHeader className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                  <Gift className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                </div>
                <CardTitle className="text-white text-lg md:text-xl">Gifting System</CardTitle>
                <CardDescription className="text-slate-400 text-sm md:text-base">
                  Send TON tokens and NFTs to fellow developers to support their journey
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card hover:glow-cyan transition-all duration-300">
              <CardHeader className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                  <Github className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                </div>
                <CardTitle className="text-white text-lg md:text-xl">GitHub Sync</CardTitle>
                <CardDescription className="text-slate-400 text-sm md:text-base">
                  Automatically track your TON-related repositories and contributions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card hover:glow-blue transition-all duration-300">
              <CardHeader className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                </div>
                <CardTitle className="text-white text-lg md:text-xl">XP & Streaks</CardTitle>
                <CardDescription className="text-slate-400 text-sm md:text-base">
                  Build coding streaks and level up your developer profile with XP points
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass-card hover:glow-cyan transition-all duration-300">
              <CardHeader className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                  <Trophy className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
                </div>
                <CardTitle className="text-white text-lg md:text-xl">Leaderboards</CardTitle>
                <CardDescription className="text-slate-400 text-sm md:text-base">
                  Compete with other developers and climb the global rankings
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-8 md:p-12 rounded-2xl">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Your <span className="gradient-text">TON Journey</span>?
            </h2>
            <p className="text-slate-400 text-base md:text-lg mb-6 md:mb-8">
              Join thousands of developers building the future of blockchain
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 glow-blue w-full sm:w-auto">
                <Github className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Start Building Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
