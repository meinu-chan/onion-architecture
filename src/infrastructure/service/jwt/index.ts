import { config } from '../../../config.js'
import { createSigner, createVerifier } from 'fast-jwt'
import type { JWTService } from '../../../core/service/jwt/index.js'

const { jwt } = config

const signAccessToken = createSigner({
  key: async () => Promise.resolve(jwt.secretToken),
  expiresIn: 1000
})

const signRefreshToken = createSigner({
  key: async () => Promise.resolve(jwt.secretToken)
})

const verify = createVerifier({
  key: async () => Promise.resolve(jwt.secretToken)
})

export const jwtService: JWTService = {
  createAccessToken: (id: number) => signAccessToken({ id }),
  createRefreshToken: () => signRefreshToken({}),
  verifyAccessToken: async (token: string) => {
    try {
      const verified = await verify(token)
      return { ...verified, expired: false }
    } catch (error: any) {
      if (isExpiredErrorMessage(error?.message)) {
        return { id: null, expired: true }
      }

      return false
    }
  }
}

function isExpiredErrorMessage(message: string): boolean {
  return /token has expired/.test(message.toLowerCase())
}
