"use client"

import { useState } from "react"
import { MobileSidebar } from "@/components/layout/MobileSidebar"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"
import { AuthProvider } from "@/lib/auth/auth-context"
import type { AuthUser } from "@/lib/auth/types"

interface DashboardLayoutProps {
  initialUser: AuthUser
  children: React.ReactNode
}

export function DashboardLayout({ initialUser, children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthProvider initialUser={initialUser}>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <MobileSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

        <div className="md:ml-64">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AuthProvider>
  )
}
