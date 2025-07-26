// Unified API client for all network requests
import { API_URL } from '.'

export type ApiClientOptions = {
  method: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: any
}

export async function apiClient(
  endpoint: string,
  options: ApiClientOptions
): Promise<any> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method,
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      // 'user-agent': 'Ncsuguessr/1.0',
      ...(options.headers || {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`API error: ${response.status} - ${errorText}`)
  }

  return response.json()
}
