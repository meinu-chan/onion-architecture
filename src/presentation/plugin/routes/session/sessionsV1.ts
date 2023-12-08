import type { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import { PRESENTATION_SYMBOL_CONTROLLER } from '../../../PresentationSymbols.js'
import type { SessionController } from '../../../controller/session/SessionController.js'
import type { SessionWithAccessToken } from '../../../../core/repository/Session/request/SessionWithAccessTokenRequest.js'
import { Static, Type } from '@sinclair/typebox'
import { statusCode } from '../../util/statusCode.js'

const signUpRequestSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  name: Type.String(),
  password: Type.String()
})

const signInRequestSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String()
})

const loginResponseSchema = Type.Object({
  refresh_token: Type.String(),
  access_token: Type.String()
})

export const usersV1: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: (err?: Error) => void
): void => {
  const sessionController = fastify.dc.get<SessionController>(
    PRESENTATION_SYMBOL_CONTROLLER.SESSION_CONTROLLER
  )

  fastify.post(
    '/sign-up',
    {
      schema: {
        body: signUpRequestSchema,
        response: {
          201: loginResponseSchema
        }
      }
    },
    async (
      request: FastifyRequest<{ Body: Static<typeof signUpRequestSchema> }>,
      reply: FastifyReply
    ): Promise<SessionWithAccessToken> => {
      const user = await sessionController.signUp(request.body)

      void reply.status(statusCode.CREATED)

      return user
    }
  )

  fastify.post(
    '/sign-in',
    {
      schema: {
        body: signInRequestSchema,
        response: {
          200: loginResponseSchema
        }
      }
    },
    async (
      request: FastifyRequest<{ Body: Static<typeof signInRequestSchema> }>,
      reply: FastifyReply
    ): Promise<SessionWithAccessToken> => {
      const user = await sessionController.signIn(request.body)

      void reply.status(statusCode.OK)

      return user
    }
  )

  done()
}
