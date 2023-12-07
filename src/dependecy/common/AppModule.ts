import { ApiRequestHandler } from '../../ui/controller/ApiRequestHandler.js'
import { ContainerModule } from 'inversify'
import { CORE_COMMON } from '../../core/CoreSymbols.js'
import type { Logger } from 'winston'
import { loggerFactory } from '../../core/common/logger.js'
import { PostgresPool } from '../../infrastructure/database/PostgresPool.js'

export class AppModule extends ContainerModule {
  public constructor() {
    super((bind) => {
      bind<Logger>(CORE_COMMON.LOGGER).toConstantValue(loggerFactory())
      bind<ApiRequestHandler>(ApiRequestHandler).toSelf()

      bind(PostgresPool).to(PostgresPool)
    })
  }
}
