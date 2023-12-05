import { ApiError } from '../../../util/error/ApiError.js'
import type { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify'
import { RepositoryService } from '../../../database/RepositoryService.js'
import { Static, Type } from '@sinclair/typebox'
import { statusCode } from '../../util/statusCode.js'
import {
  AbstractUserRepository,
  type LoadedUserEntity
} from '../../../database/abstract/AbstractUserRepository.js'

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
  const repositoryService = fastify.dc.resolve(RepositoryService)
  const userRepository = repositoryService.getRepository(AbstractUserRepository)

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
