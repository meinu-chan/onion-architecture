import { APP_SERVICE } from '../../../app/AppSymbols.js'
import { CORE_SERVICE } from '../../../core/CoreSymbols.js'
import { inject, injectable } from 'inversify'
import type { JWTService } from '../../../core/service/jwt/index.js'
import type { PasswordService } from '../../../core/service/password/index.js'
import type { SessionService } from '../../../app/session/index.js'
import { Static, Type } from '@sinclair/typebox'
import type { UserService } from '../../../app/user/index.js'
import { RouteHandler, type RequestSchema } from '../../RouteHandler.js'

const requestBodySchema = Type.Object(
  {
    email: Type.String(),
    name: Type.String(),
    password: Type.String()
  },
  { additionalProperties: false }
)

const responseSchema = Type.Object(
  {
    refreshToken: Type.String(),
    accessToken: Type.String()
  },
  { additionalProperties: false }
)

type ApiRequest = Static<typeof requestBodySchema>
type ApiResponse = Static<typeof responseSchema>

@injectable()
export default class SignUpRouteHandler extends RouteHandler<
  typeof requestBodySchema,
  typeof responseSchema
> {
  public constructor(
    @inject(CORE_SERVICE.PASSWORD_SERVICE)
    private readonly password: PasswordService,

    @inject(APP_SERVICE.USER_SERVICE)
    private readonly user: UserService,

    @inject(APP_SERVICE.SESSION_SERVICE)
    private readonly session: SessionService,

    @inject(CORE_SERVICE.JWT_SERVICE)
    private readonly jwt: JWTService
  ) {
    super()
  }

  protected getSchema(): RequestSchema {
    return { payload: requestBodySchema, return: responseSchema }
  }

  protected async handle(payload: ApiRequest): Promise<ApiResponse> {
    const { password: rawPassword, ...restUserData } = payload
    const password = await this.password.hash(rawPassword)
    const user = await this.user.save({ ...restUserData, password })
    const { refreshToken } = await this.session.create(user.id)
    const accessToken = await this.jwt.createAccessToken(user.id)
    return { accessToken, refreshToken }
  }
}
