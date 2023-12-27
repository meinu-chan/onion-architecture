import type { PasswordService } from '../../../core/service/password/index.js'
import type { SessionService } from '../../../core/service/session/index.js'
import { Static, Type } from '@sinclair/typebox'
import type { UserService } from '../../../core/service/user/index.js'

// interface RequestSchema {
//   body?: any
//   response: any
// }

// interface RequestHandler {
//   method: 'POST' | 'PUT' | 'GET' | 'DELETE' | 'PATCH'
//   url: string
//   schema: RequestSchema
//   handler: any
// }

interface RequestDependency {
  services: {
    user: UserService
    session: SessionService
  }
  util: {
    password: PasswordService
  }
}

interface RequestPayload {
  body: Static<typeof requestBodySchema>
}

type Response = Static<typeof responseSchema>

const requestBodySchema = Type.Object({
  email: Type.String({ format: 'email' }),
  name: Type.String(),
  password: Type.String()
})

const responseSchema = Type.Object({
  refreshToken: Type.String(),
  accessToken: Type.String()
})

export const signUp = {
  method: 'POST',
  url: '/sign-up', // TODO: get name from file name
  schema: { body: requestBodySchema, response: responseSchema },
  handler: async (
    deps: RequestDependency,
    payload: RequestPayload
  ): Promise<Response> => {
    const { password, ...body } = payload.body

    const hashedPassword = await deps.util.password.hash(password)

    const user = await deps.services.user.save({
      ...body,
      password: hashedPassword
    })

    const session = await deps.services.session.create(user.id)

    return session
  }
}
