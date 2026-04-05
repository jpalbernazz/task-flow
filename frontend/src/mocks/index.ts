import { mockProjects } from "@/mocks/projects"
import { mockTaskApi } from "@/mocks/mock-task-api"
import { mockUsers } from "@/mocks/users"
import { taskApiModelToViewModel } from "@/lib/tasks/task-mapper"
import type { Project, User } from "@/lib/models/task-management"
import type { TaskStatus } from "@/lib/tasks/types"

export { mockProjects, mockTaskApi, mockUsers }

export const mockTasks = mockTaskApi.map(taskApiModelToViewModel)

export const mockData = {
  users: mockUsers,
  projects: mockProjects,
  taskApi: mockTaskApi,
  taskView: mockTasks,
}

export const usersById: Record<number, User> = mockUsers.reduce(
  (accumulator, user) => {
    accumulator[user.id] = user
    return accumulator
  },
  {} as Record<number, User>
)

export const projectsById: Record<number, Project> = mockProjects.reduce(
  (accumulator, project) => {
    accumulator[project.id] = project
    return accumulator
  },
  {} as Record<number, Project>
)

export function getTasksByStatus(status: TaskStatus) {
  return mockTaskApi.filter((task) => task.status === status)
}

export function getTasksByProject(projectId: number) {
  return mockTaskApi.filter((task) => task.project_id === projectId)
}

export function getTasksByAssignedUser(userId: number) {
  return mockTaskApi.filter((task) => task.assigned_user_id === userId)
}
