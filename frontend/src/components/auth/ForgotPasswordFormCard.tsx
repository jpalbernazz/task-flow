"use client"

import Link from "next/link"
import { ArrowRight, Copy, ExternalLink, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForgotPasswordPageContext } from "@/lib/auth/forgot-password-page-context"

export function ForgotPasswordFormCard() {
  const {
    email,
    isSubmitting,
    errorMessage,
    infoMessage,
    resetUrl,
    isCopying,
    setEmail,
    handleSubmit,
    handleCopyResetUrl,
  } = useForgotPasswordPageContext()

  return (
    <Card className="border-border/50 shadow-xl shadow-primary/5">
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-2xl font-semibold">Esqueci minha senha</CardTitle>
        <CardDescription className="text-muted-foreground">
          Informe seu email para gerar um link de redefinição.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 pl-10"
                required
              />
            </div>
          </div>

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

          {resetUrl ? (
            <div className="rounded-md border border-border/60 bg-muted/40 p-3">
              <p className="break-all text-xs text-muted-foreground">{resetUrl}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button asChild type="button" variant="secondary" className="h-10 gap-2">
                  <Link href={resetUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Abrir link
                  </Link>
                </Button>
                <Button type="button" variant="outline" className="h-10 gap-2" onClick={handleCopyResetUrl} disabled={isCopying}>
                  <Copy className="h-4 w-4" />
                  {isCopying ? "Copiando..." : "Copiar link"}
                </Button>
              </div>
            </div>
          ) : null}

          <Button type="submit" className="h-11 w-full gap-2 text-base font-medium" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            ) : (
              <>
                Gerar link
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Lembrou a senha?{" "}
          <Link href="/login" className="font-medium text-primary transition-colors hover:text-primary/80">
            Voltar para login
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
