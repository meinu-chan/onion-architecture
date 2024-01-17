import { CORE_REPOSITORY, CORE_SERVICE } from '../../core/CoreSymbols.js'
import { inject, injectable } from 'inversify'
import type { JWTService } from '../../core/service/jwt/index.js'
import type { Session } from '../../core/model/session/index.js'
import type { SessionRepository } from '../../core/repository/session/index.js'

@injectable()
export class SessionService {
  public constructor(
    @inject(CORE_REPOSITORY.SESSION_REPOSITORY)
    private readonly session: SessionRepository,

    @inject(CORE_SERVICE.JWT_SERVICE)
    private readonly jwt: JWTService
  ) {}

  public async create(userId: number): Promise<Session> {
    const refreshToken = await this.jwt.createRefreshToken()
    return this.session.save({ refreshToken, userId })
  }

  public async remove(refreshToken: string): Promise<void> {
    await this.session.removeByRefreshToken(refreshToken)
  }
}
