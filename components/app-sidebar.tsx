"use client"

import { Home, User, Gift, Crown, Compass, Github, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TonWalletConnect } from "@/components/ton-wallet-connect"

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Quest Explorer", url: "/quests", icon: Compass },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Gifting Center", url: "/gifting", icon: Gift },
  { title: "Leaderboard", url: "/leaderboard", icon: Crown },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user, profile, signInWithGitHub, signOut } = useAuth()

  return (
    <Sidebar className="border-r border-slate-800">
      <SidebarHeader className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="text-xl font-bold gradient-text">ForkTON.dev</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 uppercase text-xs font-semibold tracking-wider px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="hover:bg-slate-800/50 data-[active=true]:bg-blue-500/20 data-[active=true]:text-blue-400"
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        {user && profile ? (
          <>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/50">
              <Avatar className="w-6 h-6">
                <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.github_username} />
                <AvatarFallback className="bg-slate-700 text-xs">
                  {profile.github_username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">@{profile.github_username}</p>
                <p className="text-xs text-slate-400">{profile.xp} XP</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-slate-700 hover:bg-slate-800 bg-transparent text-sm"
              onClick={signOut}
            >
              <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Sign Out</span>
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-slate-700 hover:bg-slate-800 bg-transparent text-sm"
              onClick={signInWithGitHub}
            >
              <Github className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Connect GitHub</span>
            </Button>
            <TonWalletConnect variant="outline" size="sm" />
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
