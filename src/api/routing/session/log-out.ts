import { APP_SERVICE } from '../../../app/AppSymbols.js'
import { inject, injectable } from 'inversify'
import type { SessionService } from '../../../app/session/index.js'
import { Static, Type } from '@sinclair/typebox'
import {
  RequestUtil,
  RouteHandler,
  type RequestSchema
} from '../../RouteHandler.js'

const requestBodySchema = Type.Object({}, { additionalProperties: false })
const responseSchema = Type.Void()

type ApiRequest = Static<typeof requestBodySchema>
type ApiResponse = Static<typeof responseSchema>

@injectable()
export default class LogOutRouteHandler extends RouteHandler<
  typeof requestBodySchema,
  typeof responseSchema
> {
  public constructor(
    @inject(APP_SERVICE.SESSION_SERVICE)
    private readonly session: SessionService
  ) {
    super()
  }

  protected getSchema(): RequestSchema {
    return { payload: requestBodySchema, return: responseSchema }
  }

  protected async handle(
    _payload: ApiRequest,
    util: RequestUtil
  ): Promise<ApiResponse> {
    const refreshToken = await util.getRefreshToken()
    await this.session.remove(refreshToken)
  }

  protected async checkAuth(util: RequestUtil): Promise<void> {
    await util.getUser()
  }
}
