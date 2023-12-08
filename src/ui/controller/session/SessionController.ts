import type { AddUserDto } from '../../../core/repository/User/dto/AddUserDto.js'
import { ApiRequestHandler } from '../ApiRequestHandler.js'
import type { AuthenticationService } from '../../../core/service/common/Authentication/AuthenticationService.js'
import { CORE_SERVICE } from '../../../core/CoreSymbols.js'
import { inject, injectable } from 'inversify'
import type { SessionWithAccessTokenDto } from '../../../core/repository/Session/dto/SessionWithAccessTokenDto.js'
import type { SignInDto } from '../../../core/service/common/Authentication/dto/SignInDto.js'
import { SignInRequest } from './requests/SignInRequest.js'
import { SignUpRequest } from './requests/SignUpRequest.js'

@injectable()
export class SessionController {
  public constructor(
    @inject(ApiRequestHandler)
    private readonly apiRequestHandler: ApiRequestHandler,
    @inject(CORE_SERVICE.AUTH_SERVICE)
    private readonly authService: AuthenticationService
  ) {}

  public signUp(dto: AddUserDto): Promise<SessionWithAccessTokenDto> {
    return this.apiRequestHandler.handle(
      new SignUpRequest(this.authService, dto)
    )
  }

  public signIn(dto: SignInDto): Promise<SessionWithAccessTokenDto> {
    return this.apiRequestHandler.handle(
      new SignInRequest(this.authService, dto)
    )
  }
}
