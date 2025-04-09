import { Log } from '@/lib/utils/log'
import { HttpRequestClient, FetchOptions } from '@okta/okta-auth-js'

export const createHttpClient = (): HttpRequestClient => {
  return async (method: string, url: string, options: FetchOptions) => {
    try {
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      }

      const body = options.data ? JSON.stringify(options.data) : undefined

      const response = await fetch(url, {
        method,
        headers,
        body,
      })

      const responseText = await response.text()
      let responseData
      try {
        responseData = JSON.parse(responseText)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        responseData = responseText
      }

      return {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        responseText,
        responseType: 'json',
        responseData,
      }
    } catch (error) {
      Log.error('HTTP Request error', { error })
      throw error
    }
  }
}
