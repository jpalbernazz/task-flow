"use client"

import Link from "next/link"
import { ArrowRight, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useResetPasswordPageContext } from "@/lib/auth/reset-password-page-context"

export function ResetPasswordFormCard() {
  const {
    token,
    newPassword,
    confirmPassword,
    isSubmitting,
    errorMessage,
    infoMessage,
    setNewPassword,
    setConfirmPassword,
    handleSubmit,
  } = useResetPasswordPageContext()

  return (
    <Card className="border-border/50 shadow-xl shadow-primary/5">
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-2xl font-semibold">Redefinir senha</CardTitle>
        <CardDescription className="text-muted-foreground">
          Defina uma nova senha para sua conta.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-password" className="text-sm font-medium">Nova senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="new-password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="h-11 pl-10"
                minLength={8}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium">Confirmar nova senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirm-password"
                type="password"
                placeholder="Repita a nova senha"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="h-11 pl-10"
                minLength={8}
                required
              />
            </div>
          </div>

          {!token ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              O link de redefinição não possui token válido.
            </p>
          ) : null}

          {errorMessage ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          {infoMessage ? (
            <p className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
              {infoMessage}
            </p>
          ) : null}

          <Button type="submit" className="h-11 w-full gap-2 text-base font-medium" disabled={isSubmitting || !token}>
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            ) : (
              <>
                Redefinir senha
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary transition-colors hover:text-primary/80">
            Ir para login
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
