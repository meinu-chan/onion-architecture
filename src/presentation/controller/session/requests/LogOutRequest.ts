import { ApiRequest } from '../../ApiRequestHandler.js'
import type { AuthenticationService } from '../../../../core/service/common/Authentication/AuthenticationService.js'
import type { LogOutRequest } from '../../../../core/service/common/Authentication/request/LogOutRequest.js'

export class LogOutAPIRequest extends ApiRequest<
  void,
  {
    authService: AuthenticationService
  },
  LogOutRequest
> {
  public handle(): Promise<void> {
    return this.request.services.authService.logOut(this.request.payload)
  }
}
