import { APP_SERVICE } from '../../app/AppSymbols.js'
import { BaseModule, DependencyDeclaration } from '../common/BaseModule.js'
import { CORE_REPOSITORY } from '../../core/CoreSymbols.js'
import { PostgresUserRepository } from '../../infrastructure/database/repository/UserRepository.js'
import { UserService } from '../../app/user/index.js'

export class UserModule extends BaseModule {
  protected getDeclarationDependencyMap(): DependencyDeclaration[] {
    return [
      [CORE_REPOSITORY.USER_REPOSITORY, PostgresUserRepository],
      [APP_SERVICE.USER_SERVICE, UserService]
    ]
  }
}
