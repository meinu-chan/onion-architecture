import type { AddUserDto } from '../../../core/repository/User/dto/AddUserDto.js'
import type { UserService } from '../../../core/service/UserService/UserService.js'

export class UserController {
  public constructor(private readonly userService: UserService) {}

  public async createNewUser(req: any, _res: any) {
    await this.userService.saveUser(req.body as AddUserDto)
  }
}
