"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useForgotPasswordPageController } from "@/lib/auth/useForgotPasswordPageController"

type ForgotPasswordPageContextValue = ReturnType<typeof useForgotPasswordPageController>

const ForgotPasswordPageContext = createContext<ForgotPasswordPageContextValue | null>(null)

interface ForgotPasswordPageProviderProps {
  children: ReactNode
}

export function ForgotPasswordPageProvider({ children }: ForgotPasswordPageProviderProps) {
  const value = useForgotPasswordPageController()

  return <ForgotPasswordPageContext.Provider value={value}>{children}</ForgotPasswordPageContext.Provider>
}

export function useForgotPasswordPageContext(): ForgotPasswordPageContextValue {
  const context = useContext(ForgotPasswordPageContext)

  if (!context) {
    throw new Error("useForgotPasswordPageContext must be used within ForgotPasswordPageProvider")
  }

  return context
}
