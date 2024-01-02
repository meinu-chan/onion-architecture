import { BaseModule } from '../../common/BaseModule.js'
import { CORE_REPOSITORY, CORE_SERVICE } from '../../../core/CoreSymbols.js'
import { PostgresSessionRepository } from '../../../infrastructure/database/repository/SessionRepository.js'
import { SessionService } from '../../../core/service/session/impl.js'

export class SessionModule extends BaseModule {
  protected getDeclarationDependencyMap(): [
    symbol,
    new (...args: any[]) => any
  ][] {
    return [
      [CORE_REPOSITORY.SESSION_REPOSITORY, PostgresSessionRepository],
      [CORE_SERVICE.SESSION_SERVICE, SessionService]
    ]
  }
}
