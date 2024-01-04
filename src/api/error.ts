type ErrorType = 'validation_error' | 'caught_error'

interface GenericErrorResponse<TType extends ErrorType, TError = any> {
  type: TType
  error: TError
}

type ValidationErrorResponse = GenericErrorResponse<
  'validation_error',
  { path: string; message: string; value: unknown }
>

type CaughtErrorResponse = GenericErrorResponse<'caught_error'>

export type ErrorResponse = CaughtErrorResponse | ValidationErrorResponse
