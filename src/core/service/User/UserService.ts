import type { AddUserDto } from '../../repository/User/dto/AddUserDto.js'
import { CORE_REPOSITORY } from '../../CoreSymbols.js'
import { CoreError } from '../../common/errors/CoreError.js'
import type { FindUserByIdentifierDto } from '../../repository/User/dto/FindUserByIdentifierDto.js'
import { inject, injectable } from 'inversify'
import type { User } from '../../entity/User/User.js'
import type { UserRepository } from '../../repository/User/UserRepository.js'

@injectable()
export class UserService {
  public constructor(
    @inject(CORE_REPOSITORY.USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}

  public async saveUser(dto: AddUserDto): Promise<User> {
    if (await this.userRepository.getByIdentifier(dto)) {
      throw new CoreError("Duplicate of user's identifiers", {
        unhandledError: false,
        reason: 'duplicate'
      })
    }

    return this.userRepository.save(dto)
  }

  public getUser(
    identifier: FindUserByIdentifierDto
  ): Promise<User | undefined> {
    return this.userRepository.getByIdentifier(identifier)
  }
}
