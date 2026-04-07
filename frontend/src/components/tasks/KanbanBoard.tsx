"use client"

import { useMemo, useRef, useState } from "react"
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  type DragOverEvent,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { KanbanColumn } from "./KanbanColumn"
import { TaskCardOverlay } from "./TaskCard"
import { useTasksPageContext } from "@/lib/tasks/tasks-page-context"
import type { KanbanColumnData, TaskStatus } from "@/lib/tasks/types"

const validStatuses: TaskStatus[] = ["todo", "in_progress", "done"]

function getTaskId(value: UniqueIdentifier): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string" && /^\d+$/.test(value)) {
    return Number(value)
  }

  return null
}

function getColumnStatus(value: UniqueIdentifier): TaskStatus | null {
  if (typeof value !== "string" || !value.startsWith("column-")) {
    return null
  }

  const status = value.replace("column-", "") as TaskStatus
  return validStatuses.includes(status) ? status : null
}

function findColumnIndexByTaskId(columns: KanbanColumnData[], taskId: number): number {
  return columns.findIndex((column) => column.tasks.some((task) => task.id === taskId))
}

function getBoardSignature(columns: KanbanColumnData[]): string {
  return columns
    .map((column) => `${column.id}:${column.tasks.map((task) => task.id).join(",")}`)
    .join("|")
}

function moveTaskInBoard(
  columns: KanbanColumnData[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
): KanbanColumnData[] | null {
  const activeTaskId = getTaskId(activeId)
  if (activeTaskId === null) {
    return null
  }

  const sourceColumnIndex = findColumnIndexByTaskId(columns, activeTaskId)
  if (sourceColumnIndex === -1) {
    return null
  }

  const overColumnStatus = getColumnStatus(overId)
  const targetColumnIndex =
    overColumnStatus !== null
      ? columns.findIndex((column) => column.id === overColumnStatus)
      : findColumnIndexByTaskId(columns, getTaskId(overId) ?? -1)

  if (targetColumnIndex === -1) {
    return null
  }

  const sourceColumn = columns[sourceColumnIndex]
  const sourceTaskIndex = sourceColumn.tasks.findIndex((task) => task.id === activeTaskId)
  if (sourceTaskIndex === -1) {
    return null
  }

  if (sourceColumnIndex === targetColumnIndex) {
    if (overColumnStatus !== null) {
      return null
    }

    const overTaskId = getTaskId(overId)
    if (overTaskId === null) {
      return null
    }

    const targetTaskIndex = sourceColumn.tasks.findIndex((task) => task.id === overTaskId)
    if (targetTaskIndex === -1 || targetTaskIndex === sourceTaskIndex) {
      return null
    }

    const reorderedTasks = arrayMove(sourceColumn.tasks, sourceTaskIndex, targetTaskIndex)

    return columns.map((column, index) =>
      index === sourceColumnIndex ? { ...column, tasks: reorderedTasks } : column,
    )
  }

  const sourceTasks = [...sourceColumn.tasks]
  const [movedTask] = sourceTasks.splice(sourceTaskIndex, 1)
  const targetColumn = columns[targetColumnIndex]
  const targetTasks = [...targetColumn.tasks]

  let insertIndex = targetTasks.length
  if (overColumnStatus === null) {
    const overTaskId = getTaskId(overId)
    if (overTaskId !== null) {
      const foundTargetIndex = targetTasks.findIndex((task) => task.id === overTaskId)
      if (foundTargetIndex !== -1) {
        insertIndex = foundTargetIndex
      }
    }
  }

  targetTasks.splice(insertIndex, 0, {
    ...movedTask,
    status: targetColumn.id,
  })

  return columns.map((column, index) => {
    if (index === sourceColumnIndex) {
      return { ...column, tasks: sourceTasks }
    }

    if (index === targetColumnIndex) {
      return { ...column, tasks: targetTasks }
    }

    return column
  })
}

export function KanbanBoard() {
  const { columns, canReorderTasks, handleReorderTasksBoard } = useTasksPageContext()
  const [boardColumns, setBoardColumns] = useState(columns)
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null)
  const [isPersistingOrder, setIsPersistingOrder] = useState(false)
  const lastDragOverKeyRef = useRef<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
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
  )

  const displayedColumns =
    activeTaskId === null && !isPersistingOrder ? columns : boardColumns

  const activeTask = useMemo(() => {
    if (activeTaskId === null) {
      return null
    }

    for (const column of displayedColumns) {
      const foundTask = column.tasks.find((task) => task.id === activeTaskId)
      if (foundTask) {
        return foundTask
      }
    }

    return null
  }, [activeTaskId, displayedColumns])

  const isReorderDisabled = !canReorderTasks || isPersistingOrder

  const handleDragStart = (event: DragStartEvent) => {
    if (isReorderDisabled) {
      return
    }

    setBoardColumns(columns)
    lastDragOverKeyRef.current = null
    const taskId = getTaskId(event.active.id)
    setActiveTaskId(taskId)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTaskId(null)

    if (isReorderDisabled) {
      return
    }

    const { active, over } = event
    if (!over) {
      setBoardColumns(columns)
      lastDragOverKeyRef.current = null
      return
    }

    const previousColumns = columns
    const nextColumns = moveTaskInBoard(boardColumns, active.id, over.id) ?? boardColumns
    if (getBoardSignature(nextColumns) === getBoardSignature(previousColumns)) {
      setBoardColumns(previousColumns)
      return
    }

    setBoardColumns(nextColumns)
    setIsPersistingOrder(true)
    lastDragOverKeyRef.current = null

    void handleReorderTasksBoard(nextColumns)
      .catch(() => {
        setBoardColumns(previousColumns)
      })
      .finally(() => {
        setIsPersistingOrder(false)
      })
  }

  const handleDragOver = (event: DragOverEvent) => {
    const over = event.over
    if (isReorderDisabled || !over) {
      return
    }

    const dragOverKey = `${String(event.active.id)}:${String(over.id)}`
    if (lastDragOverKeyRef.current === dragOverKey) {
      return
    }
    lastDragOverKeyRef.current = dragOverKey

    setBoardColumns((currentColumns) => {
      const nextColumns = moveTaskInBoard(currentColumns, event.active.id, over.id)
      if (!nextColumns) {
        return currentColumns
      }

      return getBoardSignature(nextColumns) === getBoardSignature(currentColumns)
        ? currentColumns
        : nextColumns
    })
  }

  const handleDragCancel = () => {
    setActiveTaskId(null)
    setBoardColumns(columns)
    lastDragOverKeyRef.current = null
  }

  return (
    <div className="space-y-3">
      {!canReorderTasks ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
          Reordenacao de cards disponivel apenas em{" "}
          <span className="font-semibold text-foreground">Todos os projetos</span>.
        </div>
      ) : null}

      {isPersistingOrder ? (
        <div className="text-xs font-medium text-muted-foreground">
          Salvando ordem do Kanban...
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
  )
}
