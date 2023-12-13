import { CORE_REPOSITORY, CORE_SERVICE } from '../../CoreSymbols.js'
import { CoreError } from '../../common/errors/CoreError.js'
import { inject, injectable } from 'inversify'
import type { JWTService } from '../common/JWT/JWTService.js'
import type { SessionRepository } from '../../repository/Session/SessionRepository.js'
import type { SessionWithAccessToken } from '../../repository/Session/request/SessionWithAccessTokenRequest.js'
import type { UserService } from '../User/UserService.js'

@injectable()
export class SessionService {
  public constructor(
    @inject(CORE_REPOSITORY.SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
    @inject(CORE_SERVICE.USER_SERVICE)
    private readonly userService: UserService,
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

  public async verifySession(
    accessToken: string
  ): Promise<false | { id: number; expired: boolean }> {
    return this.jwtUtil.verifyAccessToken(accessToken)
  }

  public async restoreSession(
    refreshToken: string
  ): Promise<SessionWithAccessToken> {
    const session =
      await this.sessionRepository.findByRefreshToken(refreshToken)

    if (!session) {
      throw new CoreError(
        `Cannot refresh session has been passed invalid 'refreshToken'`,
        'unauthorized'
      )
    }

    const user = await this.userService.getUserById(session.userId)

    if (!user) {
      throw new CoreError(
        'Cannot refresh no user belongs to passed token',
        'unauthorized'
      )
    }

    return {
      ...session,
      accessToken: await this.jwtUtil.createAccessToken(user.id)
    }
  }

  public async removeSession(refreshToken: string): Promise<void> {
    await this.sessionRepository.removeByRefreshToken(refreshToken)
  }
}
