import { CORE_SERVICE } from '../../../core/CoreSymbols.js'
import type { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import { Static, Type } from '@sinclair/typebox'
import { statusCode } from '../../util/statusCode.js'
import type { User } from '../../../core/entity/User/User.js'
import type { UserService } from '../../../core/service/UserService/UserService.js'

const createUserRequestSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  name: Type.String(),
  password: Type.String()
})

const createUserResponseSchema = Type.Object({
  id: Type.Number(),
  email: Type.String(),
  name: Type.String(),
  created_at: Type.String(),
  updated_at: Type.String()
})

export const usersV1: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: (err?: Error) => void
): void => {
  const userService = fastify.dc.get<UserService>(CORE_SERVICE.USER_SERVICE)

  fastify.post(
    '/users',
    {
      schema: {
        body: createUserRequestSchema,
        response: {
          201: createUserResponseSchema
        }
      }
    },
    async (
      request: FastifyRequest<{ Body: Static<typeof createUserRequestSchema> }>,
      reply: FastifyReply
    ): Promise<User> => {
      const body = request.body

      const user = await userService.saveUser(body)

      void reply.status(statusCode.CREATED)

      return user
    }
  )

  done()
}
