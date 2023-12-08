import type { ApiRequest } from '../../ApiRequestHandler.js'
import type { AuthenticationService } from '../../../../core/service/common/Authentication/AuthenticationService.js'
import type { SessionWithAccessTokenDto } from '../../../../core/repository/Session/dto/SessionWithAccessTokenDto.js'
import type { SignInDto } from '../../../../core/service/common/Authentication/dto/SignInDto.js'

export class SignInRequest implements ApiRequest<SessionWithAccessTokenDto> {
  public constructor(
    private readonly authService: AuthenticationService,
    private readonly dto: SignInDto
  ) {}

  public handle(): Promise<SessionWithAccessTokenDto> {
    return this.authService.signIn(this.dto)
  }
}
