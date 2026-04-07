"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useResetPasswordPageController } from "@/lib/auth/useResetPasswordPageController"

type ResetPasswordPageContextValue = ReturnType<typeof useResetPasswordPageController>

const ResetPasswordPageContext = createContext<ResetPasswordPageContextValue | null>(null)

interface ResetPasswordPageProviderProps {
  children: ReactNode
}

export function ResetPasswordPageProvider({ children }: ResetPasswordPageProviderProps) {
  const value = useResetPasswordPageController()

  return <ResetPasswordPageContext.Provider value={value}>{children}</ResetPasswordPageContext.Provider>
}

export function useResetPasswordPageContext(): ResetPasswordPageContextValue {
  const context = useContext(ResetPasswordPageContext)

  if (!context) {
    throw new Error("useResetPasswordPageContext must be used within ResetPasswordPageProvider")
  }

  return context
}
