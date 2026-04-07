import assert from "node:assert/strict"
import test from "node:test"
import type { KanbanColumnData, TaskViewModel } from "@/lib/tasks/types"
import {
  getBoardSignature,
  getColumnStatus,
  getTaskId,
  moveTaskInBoard,
} from "@/lib/tasks/kanban-board"

function createTask(id: number, status: TaskViewModel["status"]): TaskViewModel {
  return {
    id,
    title: `Task ${id}`,
    description: "",
    status,
    priority: "medium",
    dueDate: "2026-01-01",
    projectId: null,
    position: id,
  }
}

function createColumns(): KanbanColumnData[] {
  return [
    {
      id: "todo",
      title: "A Fazer",
      color: "bg-muted-foreground/70",
      tasks: [createTask(1, "todo"), createTask(2, "todo")],
    },
    {
      id: "in_progress",
      title: "Em Progresso",
      color: "bg-primary",
      tasks: [createTask(3, "in_progress")],
    },
    {
      id: "done",
      title: "Concluida",
      color: "bg-success",
      tasks: [],
    },
  ]
}

test("getTaskId parses numeric and numeric-string ids", () => {
  assert.equal(getTaskId(12), 12)
  assert.equal(getTaskId("42"), 42)
  assert.equal(getTaskId("abc"), null)
})

test("getColumnStatus parses valid column ids", () => {
  assert.equal(getColumnStatus("column-todo"), "todo")
  assert.equal(getColumnStatus("column-done"), "done")
  assert.equal(getColumnStatus("todo"), null)
  assert.equal(getColumnStatus("column-archived"), null)
})

test("moveTaskInBoard reorders tasks in the same column", () => {
  const nextColumns = moveTaskInBoard(createColumns(), 2, 1)
  assert.ok(nextColumns)
  assert.deepEqual(nextColumns[0]?.tasks.map((task) => task.id), [2, 1])
})

test("moveTaskInBoard moves task across columns and updates status", () => {
  const nextColumns = moveTaskInBoard(createColumns(), 1, 3)
  assert.ok(nextColumns)
  assert.deepEqual(nextColumns[0]?.tasks.map((task) => task.id), [2])
  assert.deepEqual(nextColumns[1]?.tasks.map((task) => task.id), [1, 3])
  assert.equal(nextColumns[1]?.tasks[0]?.status, "in_progress")
})

test("moveTaskInBoard appends to target when dropping on column container", () => {
  const nextColumns = moveTaskInBoard(createColumns(), 1, "column-in_progress")
  assert.ok(nextColumns)
  assert.deepEqual(nextColumns[1]?.tasks.map((task) => task.id), [3, 1])
})

test("getBoardSignature changes after movement", () => {
  const initialColumns = createColumns()
  const nextColumns = moveTaskInBoard(initialColumns, 2, 1)

  assert.ok(nextColumns)
  assert.notEqual(getBoardSignature(initialColumns), getBoardSignature(nextColumns))
})
