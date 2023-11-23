import type { DependencyContainer } from '../dependency/DependencyContainer.ts'
import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    dc: DependencyContainer
  }
}
