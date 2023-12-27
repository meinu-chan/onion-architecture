import type { AuthService as AuthServiceAbstraction } from './index.js'
import { CORE_SERVICE } from '../../CoreSymbols.js'
import { CoreError } from '../../CoreError.js'
import { inject, injectable } from 'inversify'
import type { LogOutRequest } from './request/LogOutRequest.js'
import type { PasswordService } from '../password/index.js'
import type { SessionService } from '../session/index.js'
import type { SessionWithAccessToken } from '../../repository/session/request/SessionWithAccessTokenRequest.js'
import type { SignInRequest } from './request/SignInRequest.js'
import type { SignUpRequest } from './request/SignUpRequest.js'
import type { UserService } from '../user/index.js'

@injectable()
export class AuthService implements AuthServiceAbstraction {
  public constructor(
    @inject(CORE_SERVICE.USER_SERVICE)
    private readonly userService: UserService,
    @inject(CORE_SERVICE.SESSION_SERVICE)
    private readonly sessionService: SessionService,
    @inject(CORE_SERVICE.PASSWORD_SERVICE)
    private readonly passwordUtil: PasswordService
  ) {}

  public async signIn(request: SignInRequest): Promise<SessionWithAccessToken> {
    const user = await this.userService.getOne({ email: request.email })

    if (
      !user ||
      !(await this.passwordUtil.compare(request.password, user.password))
    ) {
      throw new CoreError('Invalid email or password mismatch', 'invalid_data')
    }

    return this.sessionService.create(user.id)
  }

  public async signUp(request: SignUpRequest): Promise<SessionWithAccessToken> {
    if (await this.userService.getOne({ email: request.email })) {
      throw new CoreError('Passed email already taken', 'entity_duplicate')
    }

    const password = await this.passwordUtil.hash(request.password)

    const user = await this.userService.save({
      email: request.email,
      name: request.name,
      password
    })

    return this.sessionService.create(user.id)
  }

  public async logOut(request: LogOutRequest): Promise<void> {
    await this.sessionService.remove(request.refreshToken)
  }
}
