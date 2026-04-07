"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import type { AuthUser } from "@/lib/auth/types"
import {
  getCurrentUser,
  logout as logoutSession,
  updateMyPassword,
  updateMyProfile,
  uploadMyAvatar,
} from "@/services/auth-service"

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  refreshUser: () => Promise<AuthUser | null>
  logout: () => Promise<void>
  uploadAvatar: (file: File) => Promise<void>
  updateProfileName: (name: string) => Promise<void>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<string>
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  initialUser?: AuthUser | null
  children: ReactNode
}

export function AuthProvider({ initialUser, children }: AuthProviderProps) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(initialUser ?? null)
  const [isLoading, setIsLoading] = useState(initialUser === undefined)

  const refreshUser = useCallback(async () => {
    setIsLoading(true)

    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      return currentUser
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialUser !== undefined) {
      setUser(initialUser)
      setIsLoading(false)
      return
    }

    void refreshUser()
  }, [initialUser, refreshUser])

  const logout = useCallback(async () => {
    await logoutSession()
    setUser(null)
    router.push("/login")
    router.refresh()
  }, [router])

  const uploadAvatar = useCallback(async (file: File) => {
    const updatedUser = await uploadMyAvatar(file)
    setUser(updatedUser)
  }, [])

  const updateProfileName = useCallback(async (name: string) => {
    const updatedUser = await updateMyProfile({ name })
    setUser(updatedUser)
  }, [])

  const updatePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    return updateMyPassword({ currentPassword, newPassword })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      refreshUser,
      logout,
      uploadAvatar,
      updateProfileName,
      updatePassword,
    }),
    [user, isLoading, refreshUser, logout, uploadAvatar, updateProfileName, updatePassword],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}
