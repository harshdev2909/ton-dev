"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Gift, Send, History, Trophy, Coins } from "lucide-react"
import { GiftModal } from "@/components/gift-modal"

export default function GiftingCenter() {
  const [selectedGiftType, setSelectedGiftType] = useState<"ton" | "nft">("ton")

  // Mock data
  const giftHistory = [
    {
      id: 1,
      type: "ton",
      amount: "10 TON",
      recipient: "alice.ton",
      message: "Great work on the smart contract!",
      date: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "nft",
      amount: "Early Adopter Badge",
      recipient: "bob.dev",
      message: "Welcome to the community!",
      date: "1 day ago",
      status: "completed",
    },
    {
      id: 3,
      type: "ton",
      amount: "5 TON",
      recipient: "charlie.ton",
      message: "Thanks for the code review",
      date: "3 days ago",
      status: "completed",
    },
  ]

  const receivedGifts = [
    {
      id: 1,
      type: "ton",
      amount: "15 TON",
      sender: "mentor.ton",
      message: "Keep up the excellent work!",
      date: "1 day ago",
    },
    {
      id: 2,
      type: "nft",
      amount: "Code Master Badge",
      sender: "admin.dev",
      message: "Congratulations on completing 10 quests!",
      date: "1 week ago",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gifting Center</h1>
          <p className="text-slate-400">Send TON tokens and NFTs to fellow developers</p>
        </div>
        <GiftModal />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Send Gift Form */}
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-cyan-400" />
                Send a Gift
              </CardTitle>
              <CardDescription>Support and appreciate fellow developers in the TON ecosystem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Gift Type Selection */}
              <div className="space-y-2">
                <Label>Gift Type</Label>
                <Tabs value={selectedGiftType} onValueChange={(value) => setSelectedGiftType(value as "ton" | "nft")}>
                  <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                    <TabsTrigger value="ton" className="flex items-center gap-2">
                      <Coins className="w-4 h-4" />
                      TON Tokens
                    </TabsTrigger>
                    <TabsTrigger value="nft" className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      NFT Badge
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Recipient */}
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient</Label>
                <Input
                  id="recipient"
                  placeholder="Enter wallet address or username"
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>

              {/* Amount/NFT Selection */}
              {selectedGiftType === "ton" ? (
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (TON)</Label>
                  <Input id="amount" type="number" placeholder="0.00" className="bg-slate-800/50 border-slate-700" />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Select NFT Badge</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700">
                      <SelectValue placeholder="Choose an NFT to gift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="early-adopter">Early Adopter Badge</SelectItem>
                      <SelectItem value="community-builder">Community Builder Badge</SelectItem>
                      <SelectItem value="mentor">Mentor Badge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message..."
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>

              {/* Send Button */}
              <Button className="w-full bg-blue-600 hover:bg-blue-700 glow-blue">
                <Send className="w-4 h-4 mr-2" />
                Send Gift
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Gift Statistics */}
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Gift Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">47 TON</div>
                <div className="text-sm text-slate-400">Total Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">12</div>
                <div className="text-sm text-slate-400">NFTs Gifted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">23</div>
                <div className="text-sm text-slate-400">Gifts Received</div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full border-slate-700 bg-transparent">
                Gift Random Developer
              </Button>
              <Button variant="outline" size="sm" className="w-full border-slate-700 bg-transparent">
                Send Thank You Note
              </Button>
              <Button variant="outline" size="sm" className="w-full border-slate-700 bg-transparent">
                Create Gift Campaign
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gift History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-orange-400" />
            Gift History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sent">
            <TabsList className="bg-slate-800/50">
              <TabsTrigger value="sent">Sent Gifts</TabsTrigger>
              <TabsTrigger value="received">Received Gifts</TabsTrigger>
            </TabsList>

            <TabsContent value="sent" className="space-y-4 mt-4">
              {giftHistory.map((gift) => (
                <div key={gift.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        gift.type === "ton" ? "bg-blue-500/20" : "bg-purple-500/20"
                      }`}
                    >
                      {gift.type === "ton" ? (
                        <Coins className="w-5 h-5 text-blue-400" />
                      ) : (
                        <Trophy className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {gift.amount} → {gift.recipient}
                      </p>
                      <p className="text-sm text-slate-400">{gift.message}</p>
                      <p className="text-xs text-slate-500">{gift.date}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{gift.status}</Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="received" className="space-y-4 mt-4">
              {receivedGifts.map((gift) => (
                <div key={gift.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        gift.type === "ton" ? "bg-blue-500/20" : "bg-purple-500/20"
                      }`}
                    >
                      {gift.type === "ton" ? (
                        <Coins className="w-5 h-5 text-blue-400" />
                      ) : (
                        <Trophy className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {gift.amount} from {gift.sender}
                      </p>
                      <p className="text-sm text-slate-400">{gift.message}</p>
                      <p className="text-xs text-slate-500">{gift.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
