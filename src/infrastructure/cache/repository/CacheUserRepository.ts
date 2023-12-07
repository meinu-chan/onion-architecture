import type { AddUserDto } from '../../../core/repository/User/dto/AddUserDto.js'
import type { FindUserByIdentifierDto } from '../../../core/repository/User/dto/FindUserByIdentifierDto.js'
import { injectable } from 'inversify'
import { store } from '../store.js'
import { User } from '../../../core/entity/User/User.js'
import type { UserRepository } from '../../../core/repository/User/UserRepository.js'

@injectable()
export class CacheUserRepository implements UserRepository {
  public save(dto: AddUserDto): Promise<User> {
    const user = new User(
      Object.keys(store).length,
      dto.name,
      dto.email,
      dto.password,
      new Date()
    )

    store[dto.email] = user

    console.dir({ store })

    return Promise.resolve(user)
  }

  public getByIdentifier(
    identifier: FindUserByIdentifierDto
  ): Promise<User | undefined> {
    return store[identifier.email]
  }
}
