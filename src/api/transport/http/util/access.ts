import type { AppContainer } from '../../../../dependency/AppContainer.js'
import { AppError } from '../../../../app/error.js'
import { CORE_SERVICE } from '../../../../core/CoreSymbols.js'
import type { JWTService } from '../../../../core/service/jwt/index.js'
import { receiveCookies } from './receive.js'
import type { IncomingMessage, ServerResponse } from 'node:http'

type HttpRequestUtilFunction<TReturn = undefined> = (
  req: IncomingMessage,
  res: ServerResponse,
  container: AppContainer
) => (...args: any[]) => Promise<TReturn>

export const getAccessToken: HttpRequestUtilFunction<string> = (
  request: IncomingMessage
) => {
  return async () => {
    const authorizationHeader = request.headers.authorization
    if (!authorizationHeader) throw new AppError('Unauthorized', 'unauthorized')
    const match = authorizationHeader.match(/Bearer (.+)/)
    if (!match) throw new AppError('Unauthorized', 'unauthorized')
    return Promise.resolve(match[1])
  }
}

const REFRESH_TOKEN_NAME = 'refresh_token'

export const saveRefreshToken: HttpRequestUtilFunction =
  (_req, response) => (refreshToken: string) => {
    response.setHeader('set-cookie', [
      `${REFRESH_TOKEN_NAME}=${refreshToken}`,
      'foo=bar'
    ])
    return Promise.resolve(undefined)
  }

export const getUser: HttpRequestUtilFunction<{ id: number }> = (
  request,
  response,
  container
) => {
  const jwtService = container.get<JWTService>(CORE_SERVICE.JWT_SERVICE)
  return async () => {
    const accessToken = await getAccessToken(request, response, container)()
    const verification = await jwtService.verifyAccessToken(accessToken)
    if (!verification) throw new AppError('Unauthorized', 'unauthorized')
    if (verification.expired) {
      throw new AppError('Token expired', 'token_expired')
    }
    return { id: verification.id }
  }
}

export const getRefreshToken: HttpRequestUtilFunction<string> =
  (request) => () => {
    const cookies = receiveCookies(request)
    if (!cookies) throw new AppError('Unauthorized', 'unauthorized')
    const refreshToken: string = cookies[REFRESH_TOKEN_NAME]
    if (!refreshToken) throw new AppError('Unauthorized', 'unauthorized')
    return Promise.resolve(refreshToken)
  }
