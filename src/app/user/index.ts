import { AppError } from '../error.js'
import { CORE_REPOSITORY } from '../../core/CoreSymbols.js'
import type { CreateUserRequest } from '../../core/repository/user/request/CreateUserRequest.js'
import { inject, injectable } from 'inversify'
import type { User } from '../../core/model/user/index.js'
import type { UserRepository } from '../../core/repository/user/index.js'

@injectable()
export class UserService {
  public constructor(
    @inject(CORE_REPOSITORY.USER_REPOSITORY)
    private readonly user: UserRepository
  ) {}

  public async save(request: CreateUserRequest): Promise<User> {
    const existingUser = await this.user.getOne(request)
    if (existingUser !== undefined) {
      throw new AppError('User already exists.', 'duplicate')
    }
    return this.user.save(request)
  }
}
