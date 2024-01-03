import { CORE_SERVICE } from '../../../core/CoreSymbols.js'
import { inject, injectable } from 'inversify'
import type { PasswordService } from '../../../core/service/password/index.js'
import type { SessionService } from '../../../core/service/session/index.js'
import { Static, Type } from '@sinclair/typebox'
import type { UserService } from '../../../core/service/user/index.js'
import { RouteHandler, type RequestSchema } from '../RouteHandler.js'

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
export class SignUpRouteHandler extends RouteHandler<
  typeof requestBodySchema,
  typeof responseSchema
> {
  public constructor(
    @inject(CORE_SERVICE.PASSWORD_SERVICE)
    private readonly password: PasswordService,

    @inject(CORE_SERVICE.USER_SERVICE)
    private readonly user: UserService,

    @inject(CORE_SERVICE.SESSION_SERVICE)
    private readonly session: SessionService
  ) {
    super()
  }

  protected getSchema(): RequestSchema {
    return { payload: requestBodySchema, return: responseSchema }
  }

  protected async handle(payload: ApiRequest): Promise<ApiResponse> {
    const { password, ...restUserData } = payload
    const hashedPassword = await this.password.hash(password)
    const user = await this.user.save({
      ...restUserData,
      password: hashedPassword
    })
    const session = await this.session.create(user.id)
    return session
  }
}
