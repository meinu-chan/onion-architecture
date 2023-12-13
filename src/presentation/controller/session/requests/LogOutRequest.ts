import type { ApiRequest } from '../../ApiRequestHandler.js'
import type { AuthenticationService } from '../../../../core/service/common/Authentication/AuthenticationService.js'
import type { LogOutRequest } from '../../../../core/service/common/Authentication/request/LogOutRequest.js'

export class LogOutAPIRequest implements ApiRequest<void> {
  public constructor(
    private readonly authService: AuthenticationService,
    private readonly request: LogOutRequest
  ) {}

  public handle(): Promise<void> {
    return this.authService.logOut(this.request)
  }
}
