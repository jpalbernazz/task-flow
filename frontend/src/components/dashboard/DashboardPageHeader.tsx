"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardPageHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Dashboard
        </h1>
        <p className="pl-0.5 text-muted-foreground">
          Bem-vindo de volta. Aqui está um resumo das suas tarefas.
        </p>
      </div>

      <Button asChild className="gap-2">
        <Link href="/tasks?create=true">
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Link>
      </Button>
    </div>
  );
}
