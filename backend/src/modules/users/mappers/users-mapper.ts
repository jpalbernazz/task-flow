import type { UserDTO, UserEntity } from "../types/users-types"

export function entityToUserDTO(entity: UserEntity): UserDTO {
  return {
    id: entity.id,
    name: entity.name,
    email: entity.email,
    avatarUrl: entity.avatar_url,
    role: entity.role,
  }
}
