import { mockProjects } from "@/mocks/projects"
import { mockTasks } from "@/mocks/tasks"
import { mockUsers } from "@/mocks/users"
import type { Project, TaskStatus, User } from "@/types"

export { mockProjects, mockTasks, mockUsers }

export const mockData = {
  users: mockUsers,
  projects: mockProjects,
  tasks: mockTasks,
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
  return mockTasks.filter((task) => task.status === status)
}

export function getTasksByProject(projectId: number) {
  return mockTasks.filter((task) => task.projectId === projectId)
}

export function getTasksByAssignedUser(userId: number) {
  return mockTasks.filter((task) => task.assignedUserId === userId)
}
