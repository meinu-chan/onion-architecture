import type { ApiRequest } from '../../ApiRequestHandler.js'
import type { AuthenticationService } from '../../../../core/service/common/Authentication/AuthenticationService.js'
import type { SessionWithAccessTokenDto } from '../../../../core/repository/Session/dto/SessionWithAccessTokenDto.js'
import type { SignUpDto } from '../../../../core/service/common/Authentication/dto/SignUpDto.js'

export class SignUpRequest implements ApiRequest<SessionWithAccessTokenDto> {
  public constructor(
    private readonly authService: AuthenticationService,
    private readonly dto: SignUpDto
  ) {}

  public handle(): Promise<SessionWithAccessTokenDto> {
    return this.authService.signUp(this.dto)
  }
}
