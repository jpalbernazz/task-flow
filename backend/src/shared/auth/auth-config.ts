const defaultSessionTtlDays = 7
const parsedSessionTtlDays = Number(process.env.SESSION_TTL_DAYS ?? defaultSessionTtlDays)

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "taskflow_session"
export const SESSION_TTL_DAYS = Number.isFinite(parsedSessionTtlDays) && parsedSessionTtlDays > 0
  ? parsedSessionTtlDays
  : defaultSessionTtlDays
export const SESSION_TTL_MS = SESSION_TTL_DAYS * 24 * 60 * 60 * 1000

const defaultResetPasswordTtlMinutes = 60
const parsedResetPasswordTtlMinutes = Number(
  process.env.RESET_PASSWORD_TTL_MINUTES ?? defaultResetPasswordTtlMinutes,
)

export const RESET_PASSWORD_TTL_MINUTES =
  Number.isFinite(parsedResetPasswordTtlMinutes) && parsedResetPasswordTtlMinutes > 0
    ? parsedResetPasswordTtlMinutes
    : defaultResetPasswordTtlMinutes
export const RESET_PASSWORD_TTL_MS = RESET_PASSWORD_TTL_MINUTES * 60 * 1000

const defaultAvatarMaxMb = 2
const parsedAvatarMaxMb = Number(process.env.AVATAR_MAX_SIZE_MB ?? defaultAvatarMaxMb)

export const AVATAR_MAX_SIZE_MB = Number.isFinite(parsedAvatarMaxMb) && parsedAvatarMaxMb > 0
  ? parsedAvatarMaxMb
  : defaultAvatarMaxMb

export const AVATAR_MAX_SIZE_BYTES = AVATAR_MAX_SIZE_MB * 1024 * 1024
export const AVATAR_UPLOADS_DIR = process.env.AVATAR_UPLOADS_DIR ?? "uploads/avatars"
