import type { DataMapper } from '../../../core/common/mapper/DataMapper.js'
import { injectable } from 'inversify'
import type { LoadedUserEntity } from '../repository/UserRepository.js'
import { User } from '../../../core/entity/User/User.js'

@injectable()
export class UserDataMapper implements DataMapper<User, LoadedUserEntity> {
  public toDomain(entity: LoadedUserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.password,
      entity.created_at
    )
  }
}
