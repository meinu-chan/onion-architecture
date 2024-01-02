import { CORE_SERVICE } from '../../../core/CoreSymbols.js'
import { inject, injectable } from 'inversify'
import type { PasswordService } from '../../../core/service/password/index.js'
import type { RequestPayload, RequestSchema, RouteHandler } from '../index.js'
import type { SessionService } from '../../../core/service/session/index.js'
import { Static, Type } from '@sinclair/typebox'
import type { UserService } from '../../../core/service/user/index.js'

const requestBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  name: Type.String(),
  password: Type.String()
})

const responseSchema = Type.Object({
  refreshToken: Type.String(),
  accessToken: Type.String()
})

type ApiResponse = Static<typeof responseSchema>

@injectable()
class SignUpRouteHandler
  implements RouteHandler<{ Body: typeof requestBodySchema }, ApiResponse>
{
  public constructor(
    @inject(CORE_SERVICE.PASSWORD_SERVICE)
    private readonly password: PasswordService,

    @inject(CORE_SERVICE.USER_SERVICE)
    private readonly user: UserService,

    @inject(CORE_SERVICE.SESSION_SERVICE)
    private readonly session: SessionService
  ) {}

  public getSchema(): RequestSchema<{
    Body: typeof requestBodySchema
    Response: typeof responseSchema
  }> {
    return { body: requestBodySchema, response: responseSchema }
  }

  public async handle(
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

export default { handler: SignUpRouteHandler }
