import type { AddUserDto } from '../../repository/User/dto/AddUserDto.js'
import { CoreError } from '../../common/errors/CoreError.js'
import type { User } from '../../entity/User/User.js'
import type { UserRepository } from '../../repository/User/UserRepository.js'

export class UserService {
  public constructor(private readonly userRepository: UserRepository) {}

  public async saveUser(dto: AddUserDto): Promise<User> {
    if (await this.userRepository.getByIdentifier(dto.email)) {
      throw new CoreError('User already exists.')
    }

    return this.userRepository.save(dto)
  }

  public getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.getByIdentifier(email)
  }
}
