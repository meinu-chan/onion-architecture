import { ApiError } from '../../../util/error/ApiError.js'
import type {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest
} from 'fastify'
import {
  LoadedUserEntity,
  UserRepository
} from '../../../database/repository/UserRepository.js'
import { statusCode } from '../../util/statusCode.js'

interface CreateUserBody {
  name: string
  email: string
  password: string
}

export const usersV1: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: (err?: Error) => void
): void => {
  fastify.post(
    '/users',
    async (
      request: FastifyRequest<{ Body: CreateUserBody }>,
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
