"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useRegisterPageController } from "@/lib/auth/useRegisterPageController"

type RegisterPageContextValue = ReturnType<typeof useRegisterPageController>

const RegisterPageContext = createContext<RegisterPageContextValue | null>(null)

interface RegisterPageProviderProps {
  children: ReactNode
}

export function RegisterPageProvider({ children }: RegisterPageProviderProps) {
  const value = useRegisterPageController()

  return <RegisterPageContext.Provider value={value}>{children}</RegisterPageContext.Provider>
}

export function useRegisterPageContext(): RegisterPageContextValue {
  const context = useContext(RegisterPageContext)

  if (!context) {
    throw new Error("useRegisterPageContext must be used within RegisterPageProvider")
  }

  return context
}
