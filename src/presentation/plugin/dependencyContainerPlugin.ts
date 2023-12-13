import fastifyPlugin from 'fastify-plugin'
import { AppContainer } from '../../dependency/AppContainer.js'
import type { FastifyInstance } from 'fastify'

export const dependencyContainerPlugin = fastifyPlugin(
  (fastify: FastifyInstance) => {
    return fastify.decorate('dc', new AppContainer())
  }
)
