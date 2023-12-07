import type { AddUserDto } from '../../../core/repository/User/dto/AddUserDto.js'
import { ApiRequestHandler } from '../ApiRequestHandler.js'
import { CORE_SERVICE } from '../../../core/CoreSymbols.js'
import { CreateUserRequest } from './requests/CreateUserRequest.js'
import { inject, injectable } from 'inversify'
import type { User } from '../../../core/entity/User/User.js'
import type { UserService } from '../../../core/service/User/UserService.js'

@injectable()
export class UserController {
  public constructor(
    @inject(ApiRequestHandler)
    private readonly apiRequestHandler: ApiRequestHandler,
    @inject(CORE_SERVICE.USER_SERVICE) private readonly userService: UserService
  ) {}

  public createUser(dto: AddUserDto): Promise<User> {
    return this.apiRequestHandler.handle(
      new CreateUserRequest(this.userService, dto)
    )
  }
}
