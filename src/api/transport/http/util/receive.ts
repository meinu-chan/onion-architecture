import type { IncomingMessage } from 'node:http'
import querystring from 'node:querystring'

export async function receiveBody(
  req: IncomingMessage
): Promise<undefined | Record<string, unknown>> {
  const buffers = []
  for await (const chunk of req) buffers.push(chunk)
  const data = Buffer.concat(buffers).toString()
  return data === '' ? undefined : JSON.parse(data)
}

export function receiveQuery(
  pathname: string
): undefined | Record<string, unknown> {
  const queryIndex = pathname.indexOf('?')
  if (queryIndex < 0) return undefined
  const query = pathname.slice(queryIndex + 1)
  return querystring.parse(query)
}

export function receiveCookies(
  req: IncomingMessage
): undefined | Record<string, string> {
  const cookieHeader = req.headers.cookie
  if (!cookieHeader) return undefined
  const cookies: Record<string, string> = {}
  for (const cookie of cookieHeader.split(';')) {
    const [key, value] = cookie.split('=')
    cookies[key.trim()] = value.trim()
  }
  return cookies
}
