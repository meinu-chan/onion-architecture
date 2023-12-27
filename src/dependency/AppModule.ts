import { AuthService } from '../core/service/auth/impl.js'
import { ContainerModule } from 'inversify'
import { CORE_COMMON, CORE_SERVICE } from '../core/CoreSymbols.js'
import type { JWTService } from '../core/service/jwt/index.js'
import { jwtService } from '../core/service/jwt/impl.js'
import type { Logger } from 'winston'
import { loggerFactory } from '../core/common/logger.js'
import { PasswordService } from '../core/service/password/impl.js'
import { PostgresPool } from '../infrastructure/database/PostgresPool.js'

export class AppModule extends ContainerModule {
  public constructor() {
    super((bind) => {
      bind<Logger>(CORE_COMMON.LOGGER).toConstantValue(loggerFactory())
      bind<JWTService>(CORE_SERVICE.JWT_SERVICE).toConstantValue(jwtService)
      bind<PasswordService>(CORE_SERVICE.PASSWORD_SERVICE).to(PasswordService)
      bind<AuthService>(CORE_SERVICE.AUTH_SERVICE).to(AuthService)

      bind(PostgresPool).toSelf()
    })
  }
}
