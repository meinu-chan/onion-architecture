import { BaseModule } from '../common/BaseModule.js'
import { CORE_REPOSITORY, CORE_SERVICE } from '../../core/CoreSymbols.js'
import { PostgresUserRepository } from '../../infrastructure/database/repository/UserRepository.js'
import { UserService } from '../../core/service/user/impl.js'

export class UserModule extends BaseModule {
  protected getDeclarationDependencyMap(): [
    symbol,
    new (...args: any[]) => any
  ][] {
    return [
      [CORE_REPOSITORY.USER_REPOSITORY, PostgresUserRepository],
      [CORE_SERVICE.USER_SERVICE, UserService]
    ]
  }
}
