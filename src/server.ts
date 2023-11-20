import fastify, { FastifyInstance } from 'fastify'
import { dependencyContainerPlugin } from './plugin/dependencyContainerPlugin.js'
import { PostgresPool } from './database/PostgresPool.js'

const server = fastify()

void server.register(dependencyContainerPlugin)

server.get('/ping', function (this: FastifyInstance, _request, _reply) {
  this.dc.resolve(PostgresPool)
  return 'pong\n'
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
