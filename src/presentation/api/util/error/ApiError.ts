import type { CoreError } from '../../../../core/common/errors/CoreError.js'
import { statusCode, type ResponseStatus } from '../statusCode.js'

export class ApiError extends Error {
  public get code(): (typeof statusCode)[ResponseStatus] {
    return statusCode[this.status]
  }

  public constructor(
    message: string,
    public status: ResponseStatus
  ) {
    super(message)
  }
}

const coreErrorReasonToApiError: Record<
  CoreError['metadata']['reason'],
  ResponseStatus
> = {
  default: 'BAD_REQUEST',
  duplicate: 'BAD_REQUEST',
  not_found: 'NOT_FOUND',
  unauthorize: 'UNAUTHORIZED'
}

export function coreToApiError(err: CoreError): void | never {
  if (err.metadata.unhandledError) {
    return
  }

  throw new ApiError(
    err.message,
    coreErrorReasonToApiError[err.metadata.reason]
  )
}
