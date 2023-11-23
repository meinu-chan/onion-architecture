import fastify, { FastifyInstance } from 'fastify'
import { dependencyContainerPlugin } from './plugin/dependencyContainerPlugin.js'
import { PostgresPool } from './database/PostgresPool.js'

export function getServer(): FastifyInstance {
  const server = fastify()

  void server.register(dependencyContainerPlugin)

  server.get('/ping', function (this: FastifyInstance, _request, _reply) {
    this.dc.resolve(PostgresPool)
    return 'pong\n'
  })

  return server
}
