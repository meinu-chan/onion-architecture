import { AppError } from '../../app/error.js'
import { STATUS_CODES } from 'node:http'

export class ApiError extends Error {
  public get status(): string {
    return STATUS_CODES[this.statusCode] ?? 'Internal Server Error'
  }

  public constructor(
    public message: string,
    public statusCode: number = 500
  ) {
    super(message)
  }

  public static from(error: any): ApiError {
    if (error instanceof AppError) {
      switch (error.type) {
        case 'duplicate':
          return new ApiError(error.message, 400)

        default:
          return new ApiError('Something went wrong.', 500)
      }
    }

    return new ApiError(error.message ?? 'Server Error.', 500)
  }
}
