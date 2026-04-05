import type { NextFunction, Request, Response } from "express"
import { AppError } from "./app-error"

interface HttpError {
  status?: number
  statusCode?: number
  type?: string
  message?: string
}

function isHttpError(error: unknown): error is HttpError {
  return typeof error === "object" && error !== null
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message })
  }

  if (isHttpError(error)) {
    if (error.type === "entity.parse.failed") {
      return res.status(400).json({ error: "invalid JSON payload" })
    }

    const statusCode = error.statusCode ?? error.status
    if (typeof statusCode === "number" && statusCode >= 400 && statusCode < 500) {
      return res.status(statusCode).json({ error: error.message ?? "request error" })
    }
  }

  console.error(error)
  return res.status(500).json({ error: "internal server error" })
}
