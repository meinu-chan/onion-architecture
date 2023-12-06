import fastify, { FastifyInstance } from 'fastify'
import { Container } from 'inversify'
import { CORE_COMMON, CORE_REPOSITORY, CORE_SERVICE } from './core/CoreSymbols.js'
import { dependencyContainerPlugin } from './plugin/dependencyContainerPlugin.js'
import { errorHandler } from './util/error/errorHandler.js'
import { PostgresPool } from './infrastructure/database/PostgresPool.js'
import { PostgresUserRepository } from './infrastructure/database/repository/UserRepository.js'
import type { Server } from 'http'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import type { UserRepository } from './core/repository/User/UserRepository.js'
import { UserService } from './core/service/UserService/UserService.js'
import { usersV1 } from './plugin/routes/user/usersV1.js'
import { loggerFactory, type Logger } from './core/common/logger.js'

export const container = new Container()

container.bind<Logger>(CORE_COMMON.LOGGER).toConstantValue(loggerFactory())

container.bind(PostgresPool).toConstantValue(new PostgresPool(loggerFactory()))

container
  .bind<UserRepository>(CORE_REPOSITORY.USER_REPOSITORY)
  .to(PostgresUserRepository)
  .inSingletonScope()

container.bind<UserService>(CORE_SERVICE.USER_SERVICE).to(UserService)

export function getServer(): FastifyInstance<Server> {
  const server = fastify<Server>({
    logger: { level: 'info' },
    ajv: {
      customOptions: {
        allErrors: true,
        removeAdditional: true,
        coerceTypes: false
      }
    }
  })

  server.withTypeProvider<TypeBoxTypeProvider>()
  server.setErrorHandler(errorHandler)

  void server.register(dependencyContainerPlugin)

  void server.register(usersV1, { prefix: '/v1' })

  return server
}
