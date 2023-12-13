import type { ApiRequest } from '../../ApiRequestHandler.js'
import type { AuthenticationService } from '../../../../core/service/common/Authentication/AuthenticationService.js'
import type { SessionWithAccessToken } from '../../../../core/repository/Session/request/SessionWithAccessTokenRequest.js'
import type { SignInRequest } from '../../../../core/service/common/Authentication/request/SignInRequest.js'

export class SignInAPIRequest implements ApiRequest<SessionWithAccessToken> {
  public constructor(
    private readonly authService: AuthenticationService,
    private readonly request: SignInRequest
  ) {}

  public handle(): Promise<SessionWithAccessToken> {
    return this.authService.authenticate(this.request)
  }
}
