import { ApiError } from './ApiError.js'
import type { FastifyReply, FastifyRequest } from 'fastify'

export function errorHandler(
  error: unknown,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ApiError) {
    void reply.status(error.code).send({
      status: error.status,
      code: error.code,
      message: error.message
    })
  } else {
    void reply.send(error)
  }
}
