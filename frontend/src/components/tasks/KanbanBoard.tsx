"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  type DragOverEvent,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCardOverlay } from "./TaskCard";
import { useTasksPageContext } from "@/lib/tasks/tasks-page-context";
import {
  getBoardSignature,
  getTaskId,
  moveTaskInBoard,
} from "@/lib/tasks/kanban-board";
import { toast } from "sonner";

export function KanbanBoard() {
  const { columns, canReorderTasks, handleReorderTasksBoard } =
    useTasksPageContext();
  const [boardColumns, setBoardColumns] = useState(columns);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [isPersistingOrder, setIsPersistingOrder] = useState(false);
  const lastDragOverKeyRef = useRef<string | null>(null);
  const persistToastIdRef = useRef<string | number | null>(null);
  const persistToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const displayedColumns =
    activeTaskId === null && !isPersistingOrder ? columns : boardColumns;

  const activeTask = useMemo(() => {
    if (activeTaskId === null) {
      return null;
    }

    for (const column of displayedColumns) {
      const foundTask = column.tasks.find((task) => task.id === activeTaskId);
      if (foundTask) {
        return foundTask;
      }
    }

    return null;
  }, [activeTaskId, displayedColumns]);

  const isReorderDisabled = !canReorderTasks || isPersistingOrder;

  const handleDragStart = (event: DragStartEvent) => {
    if (isReorderDisabled) {
      return;
    }

    setBoardColumns(columns);
    lastDragOverKeyRef.current = null;
    const taskId = getTaskId(event.active.id);
    setActiveTaskId(taskId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTaskId(null);

    if (isReorderDisabled) {
      return;
    }

    const { active, over } = event;
    if (!over) {
      setBoardColumns(columns);
      lastDragOverKeyRef.current = null;
      return;
    }

    const previousColumns = columns;
    const nextColumns =
      moveTaskInBoard(boardColumns, active.id, over.id) ?? boardColumns;
    if (getBoardSignature(nextColumns) === getBoardSignature(previousColumns)) {
      setBoardColumns(previousColumns);
      return;
    }

    setBoardColumns(nextColumns);
    setIsPersistingOrder(true);
    lastDragOverKeyRef.current = null;

    void handleReorderTasksBoard(nextColumns)
      .catch(() => {
        setBoardColumns(previousColumns);
      })
      .finally(() => {
        setIsPersistingOrder(false);
      });
  };

  const handleDragOver = (event: DragOverEvent) => {
    const over = event.over;
    if (isReorderDisabled || !over) {
      return;
    }

    const dragOverKey = `${String(event.active.id)}:${String(over.id)}`;
    if (lastDragOverKeyRef.current === dragOverKey) {
      return;
    }
    lastDragOverKeyRef.current = dragOverKey;

    setBoardColumns((currentColumns) => {
      const nextColumns = moveTaskInBoard(
        currentColumns,
        event.active.id,
        over.id,
      );
      if (!nextColumns) {
        return currentColumns;
      }

      return getBoardSignature(nextColumns) ===
        getBoardSignature(currentColumns)
        ? currentColumns
        : nextColumns;
    });
  };

  const handleDragCancel = () => {
    setActiveTaskId(null);
    setBoardColumns(columns);
    lastDragOverKeyRef.current = null;
  };

  useEffect(() => {
    if (isPersistingOrder) {
      if (!persistToastTimerRef.current && !persistToastIdRef.current) {
        persistToastTimerRef.current = setTimeout(() => {
          persistToastIdRef.current = toast.loading("Salvando ordem do Kanban...");
          persistToastTimerRef.current = null;
        }, 450);
      }
      return;
    }

    if (persistToastTimerRef.current) {
      clearTimeout(persistToastTimerRef.current);
      persistToastTimerRef.current = null;
    }

    if (persistToastIdRef.current) {
      toast.dismiss(persistToastIdRef.current);
      persistToastIdRef.current = null;
    }
  }, [isPersistingOrder]);

  useEffect(() => {
    return () => {
      if (persistToastTimerRef.current) {
        clearTimeout(persistToastTimerRef.current);
      }
      if (persistToastIdRef.current) {
        toast.dismiss(persistToastIdRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {!canReorderTasks ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
          Reordenacao de cards disponivel apenas em{" "}
          <span className="font-semibold text-foreground">
            Todos os projetos
          </span>
          .
        </div>
      ) : null}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="pb-2">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
            {displayedColumns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color}
                tasks={column.tasks}
                isReorderDisabled={isReorderDisabled}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeTask ? <TaskCardOverlay task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
