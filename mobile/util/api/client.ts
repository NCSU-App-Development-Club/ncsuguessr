// Unified API client for all network requests
import z, { ZodType, type ZodTypeAny } from 'zod'
import { API_URL } from '.'

export type ApiClientOptions = {
  method: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: unknown
}

export async function apiClient<T extends ZodTypeAny>(
  endpoint: string,
  responseSchema: T,
  options: ApiClientOptions
): Promise<z.output<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method,
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      ...(options.headers || {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API error: ${response.status} - ${errorText}`)
  }

  const responseJson = await response.json()

  return responseSchema.parse(responseJson)
}
