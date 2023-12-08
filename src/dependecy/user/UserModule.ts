import { BaseModule } from '../common/BaseModule.js'
import { CORE_REPOSITORY, CORE_SERVICE } from '../../core/CoreSymbols.js'
import { INFRASTRUCTURE_DATA_MAPPER } from '../../infrastructure/InfrastructureSymbols.js'
import { PostgresUserRepository } from '../../infrastructure/database/repository/UserRepository.js'
import { UserDataMapper } from '../../infrastructure/database/mappers/UserMapper.js'
import { UserService } from '../../core/service/User/UserService.js'

export class UserModule extends BaseModule {
  protected getDeclarationDependencyMap(): [
    symbol,
    new (...args: any[]) => any
  ][] {
    return [
      [CORE_REPOSITORY.USER_REPOSITORY, PostgresUserRepository],
      [CORE_SERVICE.USER_SERVICE, UserService],
      [INFRASTRUCTURE_DATA_MAPPER.USER_DATA_MAPPER, UserDataMapper]
    ]
  }
}
