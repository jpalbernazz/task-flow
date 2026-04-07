"use client"

import Link from "next/link"
import { ArrowRight, Lock, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRegisterPageContext } from "@/lib/auth/register-page-context"

export function RegisterPageFormCard() {
  const {
    name,
    email,
    password,
    confirmPassword,
    isSubmitting,
    errorMessage,
    infoMessage,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  } = useRegisterPageContext()

  return (
    <Card className="border-border/50 shadow-xl shadow-primary/5">
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-2xl font-semibold">Criar conta</CardTitle>
        <CardDescription className="text-muted-foreground">
          Cadastre-se para entrar no workspace compartilhado de projetos e tarefas.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-sm font-medium">Nome</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 pl-10"
                required
              />
            </div>
          </div>

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
            <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 pl-10"
                minLength={8}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium">Confirmar senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirm-password"
                type="password"
                placeholder="Repita sua senha"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="h-11 pl-10"
                minLength={8}
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

          <Button type="submit" className="h-11 w-full gap-2 text-base font-medium" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            ) : (
              <>
                Criar conta
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-primary transition-colors hover:text-primary/80">
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
