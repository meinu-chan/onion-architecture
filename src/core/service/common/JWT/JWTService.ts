import { coreConfig } from '../../../common/config.js'
import { createSigner, createVerifier } from 'fast-jwt'

export interface JWTService {
  createAccessToken: (id: number) => Promise<string>
  verifyAccessToken: (
    token: string
  ) => Promise<{ id: number; expired: boolean } | false>
  createRefreshToken: () => Promise<string>
}

const signAccessToken = createSigner({
  key: async () => Promise.resolve(coreConfig.jwt.secretToken),
  expiresIn: 1000
})

const signRefreshToken = createSigner({
  key: async () => Promise.resolve(coreConfig.jwt.secretToken)
})

const verify = createVerifier({
  key: async () => Promise.resolve(coreConfig.jwt.secretToken)
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
