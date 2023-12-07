import type { AddUserDto } from '../../../../core/repository/User/dto/AddUserDto.js'
import type { ApiRequest } from '../../ApiRequestHandler.js'
import type { User } from '../../../../core/entity/User/User.js'
import type { UserService } from '../../../../core/service/User/UserService.js'

export class CreateUserRequest implements ApiRequest<User> {
  public constructor(
    private readonly userService: UserService,
    private readonly dto: AddUserDto
  ) {}

  public handle(): Promise<User> {
    return this.userService.saveUser(this.dto)
  }
}
