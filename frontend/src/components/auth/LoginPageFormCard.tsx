"use client"

import Link from "next/link"
import { ArrowRight, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLoginPageContext } from "@/lib/auth/login-page-context"

export function LoginPageFormCard() {
  const {
    email,
    password,
    isSubmitting,
    setEmail,
    setPassword,
    handleSubmit,
  } = useLoginPageContext()

  return (
    <Card className="border-border/50 shadow-xl shadow-primary/5">
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-2xl font-semibold">Bem-vindo de volta</CardTitle>
        <CardDescription className="text-muted-foreground">
          Entre com suas credenciais para acessar sua conta
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

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
              <Link href="/esqueci-senha" className="text-sm text-primary transition-colors hover:text-primary/80">
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="h-11 w-full gap-2 text-base font-medium" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            ) : (
              <>
                Entrar
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
