import { ApiError } from '../../../util/error/ApiError.js'
import type { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import { LoadedUserEntity, UserRepository } from '../../../database/repository/UserRepository.js'
import { Static, Type } from '@sinclair/typebox'
import { statusCode } from '../../util/statusCode.js'

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
    ): Promise<LoadedUserEntity> => {
      const userRepository = fastify.dc.resolve(UserRepository)

      if (await userRepository.getEntity(request.body)) {
        throw new ApiError(
          'user with passed email already exists',
          'BAD_REQUEST'
        )
      }

      const user = await userRepository.setEntity(request.body)

      void reply.status(statusCode.CREATED)

      return user
    }
  )

  done()
}
