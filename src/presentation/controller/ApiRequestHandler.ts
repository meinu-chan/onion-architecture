import { ApiError } from '../api/util/error/ApiError.js'
import { CORE_COMMON } from '../../core/CoreSymbols.js'
import { inject, injectable } from 'inversify'
import type { Logger } from '../../core/common/logger.js'

interface Request<TServices extends Record<string, unknown>, TPayload> {
  services: TServices
  payload: TPayload
}

export abstract class ApiRequest<
  TResponse,
  TServices extends Record<string, unknown> = Record<string, unknown>,
  TPayload = unknown
> {
  public constructor(protected request: Request<TServices, TPayload>) {}

  public abstract handle(): Promise<TResponse>
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
    } catch (error: any) {
      this.logger.error(error)

      throw ApiError.from(error)
    }
  }
}
