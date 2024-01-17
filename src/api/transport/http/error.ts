import {
  apiErrorTypes,
  type ErrorResponse,
  type ApiError
} from '../../error.js'
import { STATUS_CODES } from 'node:http'

type HttpError = {
  code: number
  status: string
  error: any
}

const errorTypesToCodeMap: Record<ApiError, number> = {
  duplicate: 400,
  token_expired: 403,
  unauthorized: 401,
  unexpected_error: 500,
  validation_error: 400
}

export function httpErrorHandler(error: unknown): HttpError {
  if (isHandledError(error)) {
    const errorCode = errorTypesToCodeMap[error.error_type] ?? 500
    const errorStatus = STATUS_CODES[errorCode] ?? 'Internal Server Error'
    return { code: errorCode, status: errorStatus, error: error.error }
  }

  return {
    code: 500,
    status: 'Internal Server Error',
    error: 'Something went wrong.'
  }
}

function isHandledError(error: unknown): error is ErrorResponse {
  if (typeof error === 'object' && error !== null && 'error_type' in error) {
    return apiErrorTypes.some((apiError) => apiError === error.error_type)
  }

  return false
}
