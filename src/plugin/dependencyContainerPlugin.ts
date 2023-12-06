import fastifyPlugin from 'fastify-plugin'
import { container } from '../server.js'
import type { FastifyInstance } from 'fastify'

export const dependencyContainerPlugin = fastifyPlugin(
  (fastify: FastifyInstance) => {
    return fastify.decorate('dc', container)
  }
)
