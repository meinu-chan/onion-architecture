import fastify, { FastifyInstance } from 'fastify'
import { dependencyContainerPlugin } from './plugin/dependencyContainerPlugin.js'
import { errorHandler } from './util/error/errorHandler.js'
import type { Server } from 'http'
import { usersV1 } from './plugin/routes/user/usersV1.js'

export function getServer(): FastifyInstance<Server> {
  const server = fastify<Server>()

  void server.register(dependencyContainerPlugin)

  server.setErrorHandler(errorHandler)

  void server.register(usersV1, { prefix: '/v1' })

  return server
}
