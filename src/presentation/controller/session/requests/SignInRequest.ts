import { ApiRequest } from '../../ApiRequestHandler.js'
import type { AuthenticationService } from '../../../../core/service/common/Authentication/AuthenticationService.js'
import type { SessionWithAccessToken } from '../../../../core/repository/Session/request/SessionWithAccessTokenRequest.js'
import type { SignInRequest } from '../../../../core/service/common/Authentication/request/SignInRequest.js'

export class SignInAPIRequest extends ApiRequest<
  SessionWithAccessToken,
  {
    authService: AuthenticationService
  },
  SignInRequest
> {
  public handle(): Promise<SessionWithAccessToken> {
    return this.request.services.authService.authenticate(this.request.payload)
  }
}
