import fastify, { FastifyInstance } from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { dependencyContainerPlugin } from './presentation/plugin/dependencyContainerPlugin.js'
import { errorHandler } from './presentation/api/util/error/errorHandler.js'
import type { Server } from 'http'
import { sessionsV1 } from './presentation/api/session/sessionsV1.js'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

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
  void server.register(fastifyCookie)

  void server.register(sessionsV1, { prefix: '/v1' })

  return server
}
