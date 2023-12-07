import { ApiError, coreToApiError } from '../plugin/util/error/ApiError.js'
import { CORE_COMMON } from '../../core/CoreSymbols.js'
import { CoreError } from '../../core/common/errors/CoreError.js'
import { inject, injectable } from 'inversify'
import type { Logger } from '../../core/common/logger.js'

export interface ApiRequest<TResponse> {
  handle: () => Promise<TResponse>
}

@injectable()
export class ApiRequestHandler {
  public constructor(
    @inject(CORE_COMMON.LOGGER) private readonly logger: Logger
  ) {}

  public async handle<TResponse>(
    request: ApiRequest<TResponse>
  ): Promise<TResponse> {
    try {
      const response = await request.handle()

      return response
    } catch (error) {
      if (error instanceof CoreError) {
        coreToApiError(error)
      }

      throw new ApiError('Something went wrong...', 'INTERNAL_SERVER_ERROR')
    }
  }
}
