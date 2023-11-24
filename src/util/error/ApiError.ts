import {
  statusCode,
  type ResponseStatus
} from '../../plugin/util/statusCode.js'

export const API_ERROR = Symbol('API_ERROR')

export class ApiError extends Error {
  public errorType = API_ERROR

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
