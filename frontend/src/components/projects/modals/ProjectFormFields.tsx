"use client";

import { Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { projectStatusConfig } from "@/lib/projects/project-status";
import type { ProjectFormValues, ProjectStatus } from "@/lib/projects/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProjectFormFieldsProps {
  formValues: ProjectFormValues;
  isSubmitting: boolean;
  submitError: string | null;
  statusEntries: Array<[ProjectStatus, { label: string; className: string }]>;
  showDeleteAction?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
  handleChange: <K extends keyof ProjectFormValues>(
    field: K,
    value: ProjectFormValues[K],
  ) => void;
}

function dateStringToLocalDate(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

function dateToDateString(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function ProjectFormFields({
  formValues,
  isSubmitting,
  submitError,
  statusEntries,
  showDeleteAction = false,
  onDelete,
  isDeleting = false,
  handleChange,
}: ProjectFormFieldsProps) {
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);

  return (
    <>
      {submitError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {submitError}
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Label htmlFor="project-name">Nome</Label>
        <Input
          id="project-name"
          value={formValues.name}
          onChange={(event) => handleChange("name", event.target.value)}
          placeholder="Nome do projeto"
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="project-description">Descrição</Label>
        <Textarea
          id="project-description"
          value={formValues.description}
          onChange={(event) => handleChange("description", event.target.value)}
          placeholder="Descreva o objetivo principal do projeto"
          disabled={isSubmitting}
          rows={4}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="project-deadline">Prazo</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="project-deadline"
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formValues.deadline && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                {formValues.deadline
                  ? dateStringToLocalDate(formValues.deadline)?.toLocaleDateString(
                      "pt-BR",
                    )
                  : "Selecione uma data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateStringToLocalDate(formValues.deadline)}
                onSelect={(selectedDate) => {
                  if (!selectedDate) {
                    return;
                  }

                  handleChange("deadline", dateToDateString(selectedDate));
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="project-status">Status</Label>
          <Select
            value={formValues.status}
            onValueChange={(value) =>
              handleChange("status", value as ProjectStatus)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger id="project-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusEntries.map(([statusValue, status]) => (
                <SelectItem key={statusValue} value={statusValue}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant="secondary"
          className={cn(
            "font-medium",
            projectStatusConfig[formValues.status].className,
          )}
        >
          {projectStatusConfig[formValues.status].label}
        </Badge>
        {showDeleteAction ? (
          <Popover open={isDeletePopoverOpen} onOpenChange={setIsDeletePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={isSubmitting || isDeleting}
                aria-label="Excluir projeto"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-3">
              <p className="text-sm text-foreground">
                Excluir este projeto permanentemente?
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeletePopoverOpen(false)}
                  disabled={isSubmitting || isDeleting}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={isSubmitting || isDeleting}
                  onClick={() => {
                    onDelete?.();
                    setIsDeletePopoverOpen(false);
                  }}
                >
                  {isDeleting ? "Excluindo..." : "Confirmar"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : null}
      </div>
    </>
  );
}
