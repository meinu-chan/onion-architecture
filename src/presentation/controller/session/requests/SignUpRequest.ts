import { ApiRequest } from '../../ApiRequestHandler.js'
import type { AuthenticationService } from '../../../../core/service/common/Authentication/AuthenticationService.js'
import type { SessionWithAccessToken } from '../../../../core/repository/Session/request/SessionWithAccessTokenRequest.js'
import type { SignUpRequest } from '../../../../core/service/common/Authentication/request/SignUpRequest.js'

export class SignUpAPIRequest extends ApiRequest<
  SessionWithAccessToken,
  { authService: AuthenticationService },
  SignUpRequest
> {
  public handle(): Promise<SessionWithAccessToken> {
    return this.request.services.authService.signUp(this.request.payload)
  }
}
