import fastify, { FastifyInstance } from 'fastify'
import { dependencyContainerPlugin } from './plugin/dependencyContainerPlugin.js'
import { dependencyRegistry } from './dependency/DependencyRegistry.js'
import { errorHandler } from './util/error/errorHandler.js'
import { PostgresDataService } from './database/PostgresRepositoryService.js'
import { RepositoryService } from './database/RepositoryService.js'
import type { Server } from 'http'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { usersV1 } from './plugin/routes/user/usersV1.js'

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

dependencyRegistry.set(RepositoryService, {
  useClass: PostgresDataService,
  singleton: true,
  disposable: true
})
