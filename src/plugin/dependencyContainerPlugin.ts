import fastifyPlugin from 'fastify-plugin'
import type { FastifyInstance } from 'fastify'
import { processDependencyContainer } from '../dependecy/ProcessDependencyContainer.js'

export const dependencyContainerPlugin = fastifyPlugin(
  (fastify: FastifyInstance) => {
    return fastify.decorate('dc', processDependencyContainer)
  }
)
