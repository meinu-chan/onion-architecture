import { CORE_SERVICE } from '../../../CoreSymbols.js'
import { CoreError } from '../../../common/errors/CoreError.js'
import { inject, injectable } from 'inversify'
import type { LogOutRequest } from './request/LogOutRequest.js'
import type { PasswordService } from '../Password/PasswordService.js'
import type { SessionService } from '../../Session/SessionService.js'
import type { SessionWithAccessToken } from '../../../repository/Session/request/SessionWithAccessTokenRequest.js'
import type { SignInRequest } from './request/SignInRequest.js'
import type { SignUpRequest } from './request/SignUpRequest.js'
import type { UserService } from '../../User/UserService.js'

@injectable()
export class AuthenticationService {
  public constructor(
    @inject(CORE_SERVICE.USER_SERVICE)
    private readonly userService: UserService,
    @inject(CORE_SERVICE.SESSION_SERVICE)
    private readonly sessionService: SessionService,
    @inject(CORE_SERVICE.PASSWORD_SERVICE)
    private readonly passwordUtil: PasswordService
  ) {}

  public async authenticate(
    request: SignInRequest
  ): Promise<SessionWithAccessToken> {
    const user = await this.userService.getUser({ email: request.email })

    if (
      !user ||
      !(await this.passwordUtil.comparePassword(
        request.password,
        user.password
      ))
    ) {
      throw new CoreError('Invalid email or password mismatch', 'invalid_data')
    }

    return this.sessionService.createSession(user.id)
  }

  public async signUp(request: SignUpRequest): Promise<SessionWithAccessToken> {
    if (await this.userService.getUser({ email: request.email })) {
      throw new CoreError('Passed email already taken', 'entity_duplicate')
    }

    const password = await this.passwordUtil.hashPassword(request.password)

    const user = await this.userService.saveUser({
      email: request.email,
      name: request.name,
      password
    })

    return this.sessionService.createSession(user.id)
  }

  public async logOut(request: LogOutRequest): Promise<void> {
    await this.sessionService.removeSession(request.refreshToken)
  }
}
