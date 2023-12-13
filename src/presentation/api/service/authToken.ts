import { ApiError } from '../util/error/ApiError.js'
import { CORE_SERVICE } from '../../../core/CoreSymbols.js'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { SessionService } from '../../../core/service/Session/SessionService.js'

const FASTIFY_HEADERS_ACCESS_TOKEN = 'x-access-token'

const getAccessTokenFromRequest = (
  request: FastifyRequest
): string | undefined => {
  return request.headers[FASTIFY_HEADERS_ACCESS_TOKEN] as unknown as
    | undefined
    | string
}

export async function authToken(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply
) {
  let accessToken = getAccessTokenFromRequest(request)
  let userId: number

  if (!accessToken) {
    throw new ApiError('Unauthorized', 'UNAUTHORIZED')
  }

  const sessionService = this.dc.get<SessionService>(
    CORE_SERVICE.SESSION_SERVICE
  )

  const sessionData = await sessionService.verifySession(accessToken)

  if (!sessionData) {
    throw new ApiError('Unauthorized', 'UNAUTHORIZED')
  }

  if (sessionData.expired && request.cookies?.TOKEN) {
    const restoredSession = await sessionService.restoreSession(
      request.cookies?.TOKEN
    )

    accessToken = restoredSession.accessToken
    userId = restoredSession.userId
  } else {
    userId = sessionData.id
  }

  void reply.header(FASTIFY_HEADERS_ACCESS_TOKEN, accessToken)
  request.user = { id: userId }
}
