export const statusCode = {
  OK: 200,
  CREATED: 201,

  BAD_REQUEST: 400,

  INTERNAL_SERVER_ERROR: 500
} as const

export type ResponseStatus = keyof typeof statusCode
