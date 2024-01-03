import { CORE_SERVICE } from '../../../core/CoreSymbols.js'
import { inject, injectable } from 'inversify'
import type { PasswordService } from '../../../core/service/password/index.js'
import { RequestPayload, RequestSchema, RouteHandler } from '../index.js'
import type { SessionService } from '../../../core/service/session/index.js'
import { Static, Type } from '@sinclair/typebox'
import type { UserService } from '../../../core/service/user/index.js'

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

type ApiResponse = Static<typeof responseSchema>

@injectable()
export default class SignUpRouteHandler extends RouteHandler<
  { Body: typeof requestBodySchema },
  ApiResponse
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

  protected getSchema(): RequestSchema<{
    Body: typeof requestBodySchema
    Response: typeof responseSchema
  }> {
    return {
      body: requestBodySchema,
      response: responseSchema
    }
  }

  protected async handle(
    payload: RequestPayload<{ Body: typeof requestBodySchema }>
  ): Promise<{ refreshToken: string; accessToken: string }> {
    const { password, ...body } = payload.body

    const hashedPassword = await this.password.hash(password)

    const user = await this.user.save({
      ...body,
      password: hashedPassword
    })

    const session = await this.session.create(user.id)

    return session
  }
}
