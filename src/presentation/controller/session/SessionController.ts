import { ApiRequestHandler } from '../ApiRequestHandler.js'
import type { AuthenticationService } from '../../../core/service/common/Authentication/AuthenticationService.js'
import { CORE_SERVICE } from '../../../core/CoreSymbols.js'
import type { CreateUserRequest } from '../../../core/repository/User/request/CreateUserRequest.js'
import { inject, injectable } from 'inversify'
import { LogOutAPIRequest } from './requests/LogOutRequest.js'
import type { SessionWithAccessToken } from '../../../core/repository/Session/request/SessionWithAccessTokenRequest.js'
import { SignInAPIRequest } from './requests/SignInRequest.js'
import type { SignInRequest } from '../../../core/service/common/Authentication/request/SignInRequest.js'
import { SignUpAPIRequest } from './requests/SignUpRequest.js'

@injectable()
export class SessionController {
  public constructor(
    @inject(ApiRequestHandler)
    private readonly apiRequestHandler: ApiRequestHandler,
    @inject(CORE_SERVICE.AUTH_SERVICE)
    private readonly authService: AuthenticationService
  ) {}

  public signUp(request: CreateUserRequest): Promise<SessionWithAccessToken> {
    return this.apiRequestHandler.handle(
      new SignUpAPIRequest(this.authService, request)
    )
  }

  public signIn(request: SignInRequest): Promise<SessionWithAccessToken> {
    return this.apiRequestHandler.handle(
      new SignInAPIRequest(this.authService, request)
    )
  }

  public logOut(refreshToken: string): Promise<void> {
    return this.apiRequestHandler.handle(
      new LogOutAPIRequest(this.authService, { refreshToken })
    )
  }
}
