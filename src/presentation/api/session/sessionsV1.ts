import { authToken } from '../service/authToken.js'
import type { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import { PRESENTATION_SYMBOL_CONTROLLER } from '../../PresentationSymbols.js'
import { presentationConfig } from '../../config.js'
import type { SessionController } from '../../controller/session/SessionController.js'
import type { SessionWithAccessToken } from '../../../core/repository/Session/request/SessionWithAccessTokenRequest.js'
import { Static, Type } from '@sinclair/typebox'

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
  refreshToken: Type.String(),
  accessToken: Type.String()
})

export const sessionsV1: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: (err?: Error) => void
): void => {
  const sessionController = fastify.dc.get<SessionController>(
    PRESENTATION_SYMBOL_CONTROLLER.SESSION_CONTROLLER
  )

  const COOKIE_TOKEN = 'TOKEN'

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
      const session = await sessionController.signUp(request.body)

      void reply.status(201)
      void reply.setCookie(COOKIE_TOKEN, session.refreshToken, {
        maxAge: presentationConfig.session.maxAge
      })

      return session
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
      const session = await sessionController.signIn(request.body)

      void reply.status(200)
      void reply.setCookie(COOKIE_TOKEN, session.refreshToken, {
        maxAge: presentationConfig.session.maxAge
      })

      return session
    }
  )

  fastify.post(
    '/log-out',
    {
      schema: {
        response: {
          204: { type: 'null' }
        }
      },
      preHandler: [authToken]
    },
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      await sessionController.logOut(request.cookies[COOKIE_TOKEN]!)

      void reply.status(204)
      void reply.clearCookie(COOKIE_TOKEN, { expires: new Date() })

      // return session
    }
  )

  done()
}
