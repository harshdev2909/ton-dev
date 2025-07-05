"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, Send, Coins, Trophy } from "lucide-react"

export function GiftModal() {
  const [open, setOpen] = useState(false)
  const [giftType, setGiftType] = useState<"ton" | "nft">("ton")

  const handleSendGift = () => {
    // Placeholder for sendGift() Supabase function
    console.log("Sending gift...")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 glow-blue">
          <Gift className="w-4 h-4 mr-2" />
          Send Gift
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-cyan-400" />
            Send a Gift
          </DialogTitle>
          <DialogDescription>Send TON tokens or NFT badges to support fellow developers</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Gift Type */}
          <Tabs value={giftType} onValueChange={(value) => setGiftType(value as "ton" | "nft")}>
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
              <TabsTrigger value="ton" className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                TON
              </TabsTrigger>
              <TabsTrigger value="nft" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                NFT
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Recipient */}
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="Wallet address or username"
              className="bg-slate-800/50 border-slate-700"
            />
          </div>

          {/* Amount/NFT */}
          {giftType === "ton" ? (
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (TON)</Label>
              <Input id="amount" type="number" placeholder="0.00" className="bg-slate-800/50 border-slate-700" />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Select NFT</Label>
              <Select>
                <SelectTrigger className="bg-slate-800/50 border-slate-700">
                  <SelectValue placeholder="Choose NFT" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="early-adopter">Early Adopter Badge</SelectItem>
                  <SelectItem value="mentor">Mentor Badge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Add a message..." className="bg-slate-800/50 border-slate-700" />
          </div>

          <Button onClick={handleSendGift} className="w-full bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />
            Send Gift
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
