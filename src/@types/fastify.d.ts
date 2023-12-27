import type { Container } from 'inversify'
import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    dc: Container
  }
}
