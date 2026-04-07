"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/get-error-message";
import type {
  RecentTaskItem,
  RecentTaskPriority,
  RecentTaskStatus,
} from "@/lib/dashboard/types";
import { useDashboardPageContext } from "@/lib/dashboard/dashboard-page-context";
import { taskPriorityConfig, taskStatusConfig } from "@/lib/tasks/task-meta";
import { deleteTask } from "@/services/task-service";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig: Record<
  RecentTaskStatus,
  { label: string; className: string }
> = {
  todo: {
    label: taskStatusConfig.todo.label,
    className: taskStatusConfig.todo.className,
  },
  "in-progress": {
    label: taskStatusConfig.in_progress.label,
    className: taskStatusConfig.in_progress.className,
  },
  completed: {
    label: taskStatusConfig.done.label,
    className: taskStatusConfig.done.className,
  },
  overdue: {
    label: "Atrasada",
    className: "bg-destructive/10 text-destructive",
  },
};

const priorityConfig: Record<
  RecentTaskPriority,
  { label: string; className: string }
> = {
  low: {
    label: taskPriorityConfig.low.label,
    className: taskPriorityConfig.low.className,
  },
  medium: {
    label: taskPriorityConfig.medium.label,
    className: taskPriorityConfig.medium.className,
  },
  high: {
    label: taskPriorityConfig.high.label,
    className: taskPriorityConfig.high.className,
  },
};

export function TaskList() {
  const { recentTasks, refreshDashboard } = useDashboardPageContext();

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-6">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-card-foreground">
            Tarefas Relevantes
          </h2>
          <p className="text-sm text-muted-foreground pl-px">
            Tarefas priorizadas por prazo e status
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/tasks">Ver todas</Link>
        </Button>
      </div>

      <div className="divide-y divide-border">
        {recentTasks.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">
            Nenhuma tarefa relevante encontrada no momento.
          </div>
        ) : (
          recentTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onTaskDeleted={async () => {
                await refreshDashboard();
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TaskRow({
  task,
  onTaskDeleted,
}: {
  task: RecentTaskItem;
  onTaskDeleted: () => Promise<void>;
}) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];

  const handleDeleteTask = async () => {
    const taskId = Number(task.id);
    if (!Number.isInteger(taskId) || taskId <= 0) {
      toast.error("Não foi possível excluir a tarefa.");
      return;
    }

    setIsDeleting(true);
    try {
      const deleted = await deleteTask(taskId);
      if (!deleted) {
        toast.error("A tarefa não foi encontrada para exclusão.");
        return;
      }

      toast.success("Tarefa excluída com sucesso.");
      await onTaskDeleted();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Não foi possível excluir a tarefa."));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50 md:p-5">
      <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-center md:gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-card-foreground">
            {task.title}
          </p>
          <p className="text-sm text-muted-foreground">{task.project}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <Badge
            variant="secondary"
            className={cn("text-xs", status.className)}
          >
            {status.label}
          </Badge>
          <Badge
            variant="secondary"
            className={cn("text-xs", priority.className)}
          >
            {priority.label}
          </Badge>
        </div>
      </div>

      <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
        <Clock className="h-4 w-4" />
        <span>{task.dueDate}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Opções</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => router.push(`/tasks?edit=${task.id}`)}
          >
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setIsDeleteDialogOpen(true)}
          >
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setIsDeleteDialogOpen(open);
          }
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação remove a tarefa permanentemente. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={async (event) => {
                event.preventDefault();
                await handleDeleteTask();
              }}
            >
              {isDeleting ? "Excluindo..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
