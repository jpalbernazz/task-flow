"use client";

import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjectsPageContext } from "@/lib/projects/projects-page-context";

export function ProjectsPageHeader() {
  const { searchTerm, setSearchTerm, handleOpenCreateModal } =
    useProjectsPageContext();

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Projetos
          </h1>
          <p className="pl-0.5 text-muted-foreground">
            Gerencie e acompanhe todos os seus projetos
          </p>
        </div>
        <Button className="gap-2" onClick={handleOpenCreateModal}>
          <Plus className="h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar projetos..."
            className="pl-9"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>
    </>
  );
}
