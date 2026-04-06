"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useLoginPageController } from "@/lib/auth/useLoginPageController"

type LoginPageContextValue = ReturnType<typeof useLoginPageController>

const LoginPageContext = createContext<LoginPageContextValue | null>(null)

interface LoginPageProviderProps {
  children: ReactNode
}

export function LoginPageProvider({ children }: LoginPageProviderProps) {
  const value = useLoginPageController()

  return (
    <LoginPageContext.Provider value={value}>
      {children}
    </LoginPageContext.Provider>
  )
}

export function useLoginPageContext(): LoginPageContextValue {
  const context = useContext(LoginPageContext)

  if (!context) {
    throw new Error("useLoginPageContext must be used within LoginPageProvider")
  }

  return context
}
