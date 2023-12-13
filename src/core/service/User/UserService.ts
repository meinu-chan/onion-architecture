import { CORE_REPOSITORY } from '../../CoreSymbols.js'
import { CoreError } from '../../common/errors/CoreError.js'
import type { CreateUserRequest } from '../../repository/User/request/CreateUserRequest.js'
import type { FindUserByUniqueValuesRequest } from '../../repository/User/request/FindUserByIdentifierRequest.js'
import { inject, injectable } from 'inversify'
import type { User } from '../../entity/User/User.js'
import type { UserRepository } from '../../repository/User/UserRepository.js'

@injectable()
export class UserService {
  public constructor(
    @inject(CORE_REPOSITORY.USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}

  public async saveUser(dto: CreateUserRequest): Promise<User> {
    if (await this.userRepository.getByUniqueValue(dto)) {
      throw new CoreError("Duplicate of user's identifiers", {
        unhandledError: false,
        reason: 'duplicate'
      })
    }

    return this.userRepository.save(dto)
  }

  public getUser(
    identifier: FindUserByUniqueValuesRequest
  ): Promise<User | undefined> {
    return this.userRepository.getByUniqueValue(identifier)
  }

  public getUserById(id: number): Promise<User | undefined> {
    return this.userRepository.getById(id)
  }
}
