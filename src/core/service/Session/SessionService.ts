import { CORE_REPOSITORY, CORE_SERVICE } from '../../CoreSymbols.js'
import { inject, injectable } from 'inversify'
import type { JWTService } from '../common/JWT/JWTService.js'
import type { SessionRepository } from '../../repository/Session/SessionRepository.js'
import type { SessionWithAccessToken } from '../../repository/Session/request/SessionWithAccessTokenRequest.js'

@injectable()
export class SessionService {
  public constructor(
    @inject(CORE_REPOSITORY.SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
    @inject(CORE_SERVICE.JWT_SERVICE) private readonly jwtUtil: JWTService
  ) {}

  public async createSession(userId: number): Promise<SessionWithAccessToken> {
    const refreshToken = await this.jwtUtil.createRefreshToken()
    const session = await this.sessionRepository.save({ userId, refreshToken })
    const accessToken = await this.jwtUtil.createAccessToken(userId)

    return {
      ...session,
      accessToken
    }
  }

  public async removeSession(refreshToken: string): Promise<void> {
    await this.sessionRepository.removeByRefreshToken(refreshToken)
  }
}
