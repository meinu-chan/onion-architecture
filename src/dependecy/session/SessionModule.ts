import { ContainerModule } from 'inversify'
import { CORE_REPOSITORY, CORE_SERVICE } from '../../core/CoreSymbols.js'
import type { DataMapper } from '../../core/common/mapper/DataMapper.js'
import { INFRASTRUCTURE_DATA_MAPPER } from '../../infrastructure/InfrastructureSymbols.js'
import { PostgresSessionRepository } from '../../infrastructure/database/repository/SessionRepository.js'
import { SessionController } from '../../ui/controller/session/SessionController.js'
import { SessionDataMapper } from '../../infrastructure/database/mappers/SessionMapper.js'
import type { SessionRepository } from '../../core/repository/Session/SessionRepository.js'
import { SessionService } from '../../core/service/Session/SessionService.js'
import { UI_SYMBOL_CONTROLLER } from '../../ui/UISymbols.js'

export class SessionModule extends ContainerModule {
  public constructor() {
    super((bind) => {
      bind<SessionRepository>(CORE_REPOSITORY.SESSION_REPOSITORY).to(
        PostgresSessionRepository
      )

      bind<SessionService>(CORE_SERVICE.SESSION_SERVICE).to(SessionService)
      bind<SessionController>(UI_SYMBOL_CONTROLLER.SESSION_CONTROLLER).to(
        SessionController
      )
      bind<DataMapper>(INFRASTRUCTURE_DATA_MAPPER.SESSION_DATA_MAPPER).to(
        SessionDataMapper
      )
    })
  }
}
