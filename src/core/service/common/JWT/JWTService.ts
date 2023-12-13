import { coreConfig } from '../../../common/config.js'
import { createDecoder, createSigner } from 'fast-jwt'
import type { User } from '../../../entity/User/User.js'

export interface JWTService {
  createAccessToken: (id: number) => Promise<string>
  verifyAccessToken: (token: string) => Promise<User>
  createRefreshToken: () => Promise<string>
}

const signAccessToken = createSigner({
  key: async () => Promise.resolve(coreConfig.jwt.secretToken),
  expiresIn: coreConfig.jwt.expiresInMs
})

const signRefreshToken = createSigner({
  key: async () => Promise.resolve(coreConfig.jwt.secretToken)
})

const verifyAccessToken = createDecoder()

export const jwtService: JWTService = {
  createAccessToken: (id: number) => signAccessToken({ id }),
  createRefreshToken: () => signRefreshToken({}),
  verifyAccessToken: (token: string) => verifyAccessToken(token)
}
