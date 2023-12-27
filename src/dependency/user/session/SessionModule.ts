import { BaseModule } from '../../common/BaseModule.js'
import { CORE_REPOSITORY, CORE_SERVICE } from '../../../core/CoreSymbols.js'
import { INFRASTRUCTURE_DATA_MAPPER } from '../../../infrastructure/InfrastructureSymbols.js'
import { PostgresSessionRepository } from '../../../infrastructure/database/repository/SessionRepository.js'
import { PRESENTATION_SYMBOL_CONTROLLER } from '../../../presentation/PresentationSymbols.js'
import { SessionController } from '../../../presentation/controller/session/SessionController.js'
import { SessionDataMapper } from '../../../infrastructure/database/mappers/session.js'
import { SessionService } from '../../../core/service/session/index.js'

export class SessionModule extends BaseModule {
  protected getDeclarationDependencyMap(): [
    symbol,
    new (...args: any[]) => any
  ][] {
    return [
      [CORE_REPOSITORY.SESSION_REPOSITORY, PostgresSessionRepository],
      [CORE_SERVICE.SESSION_SERVICE, SessionService],

      [INFRASTRUCTURE_DATA_MAPPER.SESSION_DATA_MAPPER, SessionDataMapper],

      [PRESENTATION_SYMBOL_CONTROLLER.SESSION_CONTROLLER, SessionController]
    ]
  }
}
