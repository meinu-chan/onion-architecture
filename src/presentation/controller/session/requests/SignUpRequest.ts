import type { ApiRequest } from '../../ApiRequestHandler.js'
import type { AuthenticationService } from '../../../../core/service/common/Authentication/AuthenticationService.js'
import type { SessionWithAccessToken } from '../../../../core/repository/Session/request/SessionWithAccessTokenRequest.js'
import type { SignUpRequest } from '../../../../core/service/common/Authentication/request/SignUpRequest.js'

export class SignUpAPIRequest implements ApiRequest<SessionWithAccessToken> {
  public constructor(
    private readonly authService: AuthenticationService,
    private readonly dto: SignUpRequest
  ) {}

  public handle(): Promise<SessionWithAccessToken> {
    return this.authService.signUp(this.dto)
  }
}
