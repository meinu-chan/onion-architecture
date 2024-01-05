import { type AppErrorType, appErrorTypes } from '../app/error.js'

export const apiErrorTypes = [
  'validation_error',
  'unexpected_error',
  ...appErrorTypes
] as const

export type ApiError = (typeof apiErrorTypes)[number]

interface GenericErrorResponse<
  TType extends ApiError = ApiError,
  TError = any
> {
  type: TType
  error: TError
}

type UnexpectedErrorResponse = GenericErrorResponse<'unexpected_error'>
type AppErrorResponse = GenericErrorResponse<AppErrorType, string>
type ValidationErrorResponse = GenericErrorResponse<
  'validation_error',
  { path: string; message: string; value: unknown }
>

export type ErrorResponse =
  | UnexpectedErrorResponse
  | ValidationErrorResponse
  | AppErrorResponse
