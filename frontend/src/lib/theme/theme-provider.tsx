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
import {
  DEFAULT_THEME_PREFERENCE,
  THEME_STORAGE_KEY,
} from "@/lib/theme/constants"
import type { ResolvedTheme, ThemePreference } from "@/lib/theme/types"

interface ThemeContextValue {
  preference: ThemePreference
  resolvedTheme: ResolvedTheme
  setThemePreference: (preference: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark"
}

function readStoredThemePreference(): ThemePreference {
  if (typeof window === "undefined") {
    return DEFAULT_THEME_PREFERENCE
  }

  try {
    const storedPreference = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (isThemePreference(storedPreference)) {
      return storedPreference
    }
  } catch {
    // Fall back to system preference when storage is unavailable.
  }

  return DEFAULT_THEME_PREFERENCE
}

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (preference === "system") {
    return systemPrefersDark ? "dark" : "light"
  }

  return preference
}

function applyResolvedTheme(resolvedTheme: ResolvedTheme): void {
  if (typeof document === "undefined") {
    return
  }

  document.documentElement.classList.toggle("dark", resolvedTheme === "dark")
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(() =>
    readStoredThemePreference(),
  )
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(readStoredThemePreference(), getSystemPrefersDark()),
  )

  useEffect(() => {
    setResolvedTheme(resolveTheme(preference, getSystemPrefersDark()))
  }, [preference])

  useEffect(() => {
    applyResolvedTheme(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference)
    } catch {
      // Ignore storage write errors and keep in-memory preference.
    }
  }, [preference])

  useEffect(() => {
    if (preference !== "system" || typeof window.matchMedia !== "function") {
      return
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (event: MediaQueryListEvent) => {
      setResolvedTheme(resolveTheme("system", event.matches))
    }

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange)
      return () => {
        mediaQuery.removeEventListener("change", handleChange)
      }
    }

    mediaQuery.addListener(handleChange)
    return () => {
      mediaQuery.removeListener(handleChange)
    }
  }, [preference])

  const setThemePreference = useCallback((nextPreference: ThemePreference) => {
    setPreference(nextPreference)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      preference,
      resolvedTheme,
      setThemePreference,
    }),
    [preference, resolvedTheme, setThemePreference],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}
