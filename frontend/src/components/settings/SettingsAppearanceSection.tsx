"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useTheme } from "@/lib/theme/theme-provider"
import type { ResolvedTheme, ThemePreference } from "@/lib/theme/types"

interface ThemeOption {
  value: ThemePreference
  label: string
  description: string
}

const themeOptions: ThemeOption[] = [
  {
    value: "system",
    label: "Sistema",
    description: "Segue automaticamente o tema do seu sistema operacional.",
  },
  {
    value: "light",
    label: "Claro",
    description: "Visual com fundo claro para ambientes bem iluminados.",
  },
  {
    value: "dark",
    label: "Escuro",
    description: "Visual com fundo escuro para reduzir brilho da tela.",
  },
]

const preferenceLabels: Record<ThemePreference, string> = {
  system: "Sistema",
  light: "Claro",
  dark: "Escuro",
}

const resolvedThemeLabels: Record<ResolvedTheme, string> = {
  light: "Claro",
  dark: "Escuro",
}

export function SettingsAppearanceSection() {
  const { preference, resolvedTheme, setThemePreference } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aparência</CardTitle>
        <CardDescription>
          Escolha como o TaskFlow deve exibir as cores da interface.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          role="radiogroup"
          aria-label="Preferência de tema"
          className="grid gap-3 md:grid-cols-3"
        >
          {themeOptions.map((option) => {
            const isSelected = preference === option.value

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setThemePreference(option.value)}
                className={cn(
                  "flex cursor-pointer flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors",
                  isSelected
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border hover:bg-accent/50",
                )}
              >
                <span className="text-sm font-semibold">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Preferência:</span>
          <Badge variant="secondary">{preferenceLabels[preference]}</Badge>
          <span>Tema aplicado:</span>
          <Badge variant="secondary">{resolvedThemeLabels[resolvedTheme]}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
