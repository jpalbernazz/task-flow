const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001"

export interface ApiRequestContext {
  requestHeaders?: HeadersInit
}

interface ApiFetchOptions extends RequestInit, ApiRequestContext {}

function normalizeApiPath(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  if (path.startsWith("/")) {
    return `${API_BASE_URL}${path}`
  }

  return `${API_BASE_URL}/${path}`
}

export function resolveApiUrl(path: string): string {
  return normalizeApiPath(path)
}

function mergeHeaders(...sources: Array<HeadersInit | undefined>): Headers {
  const merged = new Headers()

  for (const source of sources) {
    if (!source) {
      continue
    }

    const headers = new Headers(source)
    headers.forEach((value, key) => {
      merged.set(key, value)
    })
  }

  return merged
}

export async function apiFetch(path: string, options: ApiFetchOptions = {}): Promise<Response> {
  const { requestHeaders, headers, credentials, ...rest } = options
  const mergedHeaders = mergeHeaders(requestHeaders, headers)

  return fetch(normalizeApiPath(path), {
    ...rest,
    credentials: credentials ?? "include",
    headers: mergedHeaders,
  })
}

export async function throwApiError(response: Response, fallbackMessage: string): Promise<never> {
  let message = fallbackMessage

  try {
    const data = (await response.json()) as { error?: string }
    if (typeof data.error === "string" && data.error.trim() !== "") {
      message = data.error
    }
  } catch {
    // Keep fallback message when response body is empty or invalid JSON.
  }

  throw new Error(message)
}
