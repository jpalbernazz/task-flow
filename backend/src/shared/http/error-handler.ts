import type { NextFunction, Request, Response } from "express"
import { AppError } from "./app-error"

interface HttpError {
  status?: number
  statusCode?: number
  type?: string
  code?: string
  message?: string
}

function isHttpError(error: unknown): error is HttpError {
  return typeof error === "object" && error !== null
}

function shouldLogAuthFailure(req: Request): boolean {
  return req.path.startsWith("/auth/")
}

export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    if (shouldLogAuthFailure(req) && error.statusCode >= 400 && error.statusCode < 500) {
      console.warn(`[auth] request failed path=${req.path} ip=${req.ip} status=${error.statusCode} message=${error.message}`)
    }
    return res.status(error.statusCode).json({ error: error.message })
  }

  if (isHttpError(error)) {
    if (error.type === "entity.parse.failed") {
      return res.status(400).json({ error: "invalid JSON payload" })
    }
    if (error.message === "origin not allowed by CORS") {
      return res.status(403).json({ error: "origin not allowed by CORS" })
    }

    const statusCode = error.statusCode ?? error.status
    if (typeof statusCode === "number" && statusCode >= 400 && statusCode < 500) {
      if (shouldLogAuthFailure(req)) {
        console.warn(`[auth] request failed path=${req.path} ip=${req.ip} status=${statusCode} message=${error.message ?? "request error"}`)
      }
      return res.status(statusCode).json({ error: error.message ?? "request error" })
    }
  }

  console.error(error)
  return res.status(500).json({ error: "internal server error" })
}
