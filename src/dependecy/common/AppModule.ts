import { ApiRequestHandler } from '../../ui/controller/ApiRequestHandler.js'
import { AuthenticationService } from '../../core/service/common/Authentication/AuthenticationService.js'
import { ContainerModule } from 'inversify'
import { CORE_COMMON, CORE_SERVICE } from '../../core/CoreSymbols.js'
import type { Logger } from 'winston'
import { loggerFactory } from '../../core/common/logger.js'
import { PasswordService } from '../../core/service/common/Password/PasswordService.js'
import { PostgresPool } from '../../infrastructure/database/PostgresPool.js'
import {
  jwtService,
  type JWTService
} from '../../core/service/common/JWT/JWTService.js'

export class AppModule extends ContainerModule {
  public constructor() {
    super((bind) => {
      bind<Logger>(CORE_COMMON.LOGGER).toConstantValue(loggerFactory())
      bind<JWTService>(CORE_SERVICE.JWT_SERVICE).toConstantValue(jwtService)
      bind<PasswordService>(CORE_SERVICE.PASSWORD_SERVICE).to(PasswordService)
      bind<AuthenticationService>(CORE_SERVICE.AUTH_SERVICE).to(
        AuthenticationService
      )
      bind<ApiRequestHandler>(ApiRequestHandler).toSelf()

      bind(PostgresPool).toSelf()
    })
  }
}
