import type { DependencyContainer } from '../dependecy/DependencyContainer.ts'
import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    dc: DependencyContainer
  }
}
