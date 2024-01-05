// import { ApiError } from './ApiError.js'
// import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
// import { STATUS_CODES } from 'http'

// type ServerError = FastifyError | ApiError

export function errorHandler(error: any, _request: any, reply: any): void {
  // if (error instanceof ApiError) {
  //   return void reply.status(error.statusCode).send({
  //     status: error.status,
  //     code: error.statusCode,
  //     message: error.message
  //   })
  // }
  // if (error.validation) {
  //   const statusCode = error.statusCode ?? 400
  //   return void reply.status(statusCode).send({
  //     status: STATUS_CODES[statusCode],
  //     code: statusCode,
  //     errors: error.validation.map((validationResult) => ({
  //       code: 'ERR_VALIDATION',
  //       message:
  //         validationResult.message ?? error.message ?? 'validation error',
  //       payload: validationResult
  //     }))
  //   })
  // }
  // return void reply.send(error)
}
