import {
  statusCode,
  type ResponseStatus
} from '../../plugin/util/statusCode.js'

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
