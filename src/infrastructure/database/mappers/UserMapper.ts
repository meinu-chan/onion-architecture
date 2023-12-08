import type { DataMapper } from '../../../core/common/mapper/DataMapper.js'
import { injectable } from 'inversify'
import type { LoadedUserEntity } from '../repository/UserRepository.js'
import type { User } from '../../../core/entity/User/User.js'

@injectable()
export class UserDataMapper implements DataMapper<User, LoadedUserEntity> {
  public toDomain(entity: LoadedUserEntity): User {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      password: entity.password,
      createdAt: entity.created_at
    }
  }
}
