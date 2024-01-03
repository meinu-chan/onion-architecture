import { CORE_REPOSITORY } from '../../CoreSymbols.js'
import { CoreError } from '../../CoreError.js'
import type { CreateUserRequest } from '../../repository/user/request/CreateUserRequest.js'
import { ERROR_MESSAGE as USER_ERROR_MESSAGE } from './errorMessage.js'
import type { FindUserByUniqueValuesRequest } from '../../repository/user/request/FindUserByIdentifierRequest.js'
import { inject, injectable } from 'inversify'
import type { User } from '../../model/user/index.js'
import type { UserRepository } from '../../repository/user/index.js'
import type { UserService as UserServiceAbstraction } from './index.js'

@injectable()
export class UserService implements UserServiceAbstraction {
  public constructor(
    @inject(CORE_REPOSITORY.USER_REPOSITORY)
    private readonly userRepository: UserRepository
  ) {}

  public async save(request: CreateUserRequest): Promise<User> {
    if (await this.userRepository.getByUniqueValue(request)) {
      throw new CoreError(USER_ERROR_MESSAGE.duplicate, 'entity_duplicate')
    }

    return this.userRepository.save(request)
  }

  public getOne(
    identifier: FindUserByUniqueValuesRequest
  ): Promise<User | undefined> {
    return this.userRepository.getByUniqueValue(identifier)
  }

  public getById(id: number): Promise<User | undefined> {
    return this.userRepository.getById(id)
  }
}
