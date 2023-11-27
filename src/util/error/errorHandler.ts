import { ApiError } from './ApiError.js'
import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { statusCode } from '../../plugin/util/statusCode.js'

type ServerError = FastifyError | ApiError

export function errorHandler(
  error: ServerError,
  _request: FastifyRequest,
  reply: FastifyReply
): void {
  if (error instanceof ApiError) {
    return void reply.status(error.code).send({
      status: error.status,
      code: error.code,
      message: error.message
    })
  }

  if (error.validation) {
    return void reply.status(error.statusCode ?? 400).send({
      status: 'BAD_REQUEST' as keyof typeof statusCode,
      code: statusCode.BAD_REQUEST,
      errors: error.validation.map((validationResult) => ({
        code: 'ERR_VALIDATION',
        message:
          validationResult.message ?? error.message ?? 'validation error',
        payload: validationResult
      }))
    })
  }

  return void reply.send(error)
}
