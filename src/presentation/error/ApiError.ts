import { CoreError } from '../../core/CoreError.js'
import { STATUS_CODES } from 'node:http'

export class ApiError extends Error {
  public get status(): string {
    return STATUS_CODES[this.statusCode] ?? 'Internal Server Error'
  }

  public constructor(
    message: string,
    private statusCode: number = 500
  ) {
    super(message)
  }

  public static from(error: any): ApiError {
    if (error instanceof CoreError) {
      switch (error.type) {
        case 'entity_duplicate':
        case 'invalid_data':
          return new ApiError(error.message, 400)

        case 'not_found':
          return new ApiError(error.message, 404)

        default:
          return new ApiError('Something went wrong.', 500)
      }
    }

    return new ApiError(error.message ?? 'Server Error.', 500)
  }
}
