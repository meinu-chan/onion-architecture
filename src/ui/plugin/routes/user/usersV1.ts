import type {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest
} from 'fastify'
import { Static, Type } from '@sinclair/typebox'
import { statusCode } from '../../util/statusCode.js'
import { UI_SYMBOL_CONTROLLER } from '../../../UISymbols.js'
import type { User } from '../../../../core/entity/User/User.js'
import type { UserController } from '../../../controller/user/UserController.js'

const createUserRequestSchema = Type.Object({
  email: Type.String({ format: 'email' }),
  name: Type.String(),
  password: Type.String()
})

const createUserResponseSchema = Type.Object({
  id: Type.Number(),
  email: Type.String(),
  name: Type.String(),
  created_at: Type.String()
})

export const usersV1: FastifyPluginCallback = (
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions,
  done: (err?: Error) => void
): void => {
  const userController = fastify.dc.get<UserController>(
    UI_SYMBOL_CONTROLLER.USER_CONTROLLER
  )

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
      const user = await userController.createUser(request.body)

      void reply.status(statusCode.CREATED)

      return user
    }
  )

  done()
}