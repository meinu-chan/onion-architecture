import { APP_SERVICE } from '../../app/AppSymbols.js'
import { BaseModule, DependencyDeclaration } from '../common/BaseModule.js'
import { CORE_REPOSITORY } from '../../core/CoreSymbols.js'
import { PostgresSessionRepository } from '../../infrastructure/database/repository/SessionRepository.js'
import { SessionService } from '../../app/session/index.js'

export class SessionModule extends BaseModule {
  protected getDeclarationDependencyMap(): DependencyDeclaration[] {
    return [
      [CORE_REPOSITORY.SESSION_REPOSITORY, PostgresSessionRepository],
      [APP_SERVICE.SESSION_SERVICE, SessionService]
    ]
  }
}
