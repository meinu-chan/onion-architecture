import fastify, { FastifyInstance } from 'fastify'
import { dependencyContainerPlugin } from './plugin/dependencyContainerPlugin.js'
import { errorHandler } from './util/error/errorHandler.js'
import { PostgresDataService } from './database/postgres/PostgresRepositoryService.js'
import type { Server } from 'http'
import { setDataService } from './util/setDataService.js'
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

  setDataService(PostgresDataService)

  void server.register(dependencyContainerPlugin)

  void server.register(usersV1, { prefix: '/v1' })

  return server
}
