import { ContainerModule } from 'inversify'
import { CORE_REPOSITORY, CORE_SERVICE } from '../../core/CoreSymbols.js'
import type { DataMapper } from '../../core/common/mapper/DataMapper.js'
import { INFRASTRUCTURE_DATA_MAPPER } from '../../infrastructure/InfrastructureSymbols.js'
import { PostgresUserRepository } from '../../infrastructure/database/repository/UserRepository.js'
import { UserDataMapper } from '../../infrastructure/database/mappers/UserMapper.js'
import type { UserRepository } from '../../core/repository/User/UserRepository.js'
import { UserService } from '../../core/service/User/UserService.js'

export class UserModule extends ContainerModule {
  public constructor() {
    super((bind) => {
      bind<UserRepository>(CORE_REPOSITORY.USER_REPOSITORY).to(
        PostgresUserRepository
      )

      bind<UserService>(CORE_SERVICE.USER_SERVICE).to(UserService)
      bind<DataMapper>(INFRASTRUCTURE_DATA_MAPPER.USER_DATA_MAPPER).to(
        UserDataMapper
      )
    })
  }
}
