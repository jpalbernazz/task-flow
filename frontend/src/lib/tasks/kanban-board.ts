import { arrayMove } from "@dnd-kit/sortable"
import type { UniqueIdentifier } from "@dnd-kit/core"
import type { KanbanColumnData, TaskStatus } from "@/lib/tasks/types"

const VALID_STATUSES: TaskStatus[] = ["todo", "in_progress", "done"]

export function getTaskId(value: UniqueIdentifier): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (typeof value === "string" && /^\d+$/.test(value)) {
    return Number(value)
  }

  return null
}

export function getColumnStatus(value: UniqueIdentifier): TaskStatus | null {
  if (typeof value !== "string" || !value.startsWith("column-")) {
    return null
  }

  const status = value.replace("column-", "") as TaskStatus
  return VALID_STATUSES.includes(status) ? status : null
}

export function findColumnIndexByTaskId(columns: KanbanColumnData[], taskId: number): number {
  return columns.findIndex((column) => column.tasks.some((task) => task.id === taskId))
}

export function getBoardSignature(columns: KanbanColumnData[]): string {
  return columns
    .map((column) => `${column.id}:${column.tasks.map((task) => task.id).join(",")}`)
    .join("|")
}

export function moveTaskInBoard(
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
  if (!movedTask) {
    return null
  }

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
