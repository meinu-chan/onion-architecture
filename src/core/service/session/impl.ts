import { CORE_REPOSITORY, CORE_SERVICE } from '../../CoreSymbols.js'
import { CoreError } from '../../CoreError.js'
import { ERROR_MESSAGE as USER_ERROR_MESSAGE } from '../user/errorMessage.js'
import { ERROR_MESSAGE as SESSION_ERROR_MESSAGE } from './errorMessage.js'
import { inject, injectable } from 'inversify'
import type { JWTService } from '../jwt/index.js'
import type { SessionRepository } from '../../repository/session/index.js'
import type { SessionService as SessionServiceAbstraction } from './index.js'
import type { SessionWithAccessToken } from '../../repository/session/request/SessionWithAccessTokenRequest.js'
import type { UserService } from '../user/index.js'

@injectable()
export class SessionService implements SessionServiceAbstraction {
  public constructor(
    @inject(CORE_REPOSITORY.SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
    @inject(CORE_SERVICE.USER_SERVICE)
    private readonly userService: UserService,
    @inject(CORE_SERVICE.JWT_SERVICE) private readonly jwtService: JWTService
  ) {}

  public async create(userId: number): Promise<SessionWithAccessToken> {
    const refreshToken = await this.jwtService.createRefreshToken()
    const session = await this.sessionRepository.save({ userId, refreshToken })
    const accessToken = await this.jwtService.createAccessToken(userId)

    return {
      ...session,
      accessToken
    }
  }

  public async restore(refreshToken: string): Promise<SessionWithAccessToken> {
    const session =
      await this.sessionRepository.findByRefreshToken(refreshToken)

    if (!session) {
      throw new CoreError(SESSION_ERROR_MESSAGE.notExist, 'unauthorized')
    }

    const user = await this.userService.getById(session.userId)

    if (!user) {
      throw new CoreError(USER_ERROR_MESSAGE.notFound, 'unauthorized')
    }

    return {
      ...session,
      accessToken: await this.jwtService.createAccessToken(user.id)
    }
  }

  public async remove(refreshToken: string): Promise<void> {
    await this.sessionRepository.removeByRefreshToken(refreshToken)
  }
}
