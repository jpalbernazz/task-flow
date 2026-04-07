export interface AuthUser {
  id: number
  name: string
  email: string
  avatarUrl: string | null
  role: "user"
}
