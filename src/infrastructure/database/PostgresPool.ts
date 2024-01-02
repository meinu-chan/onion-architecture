import pg from 'pg'
import { config } from '../../config.js'
import { CORE_COMMON } from '../../core/CoreSymbols.js'
import { inject, injectable } from 'inversify'
import type { Logger } from '../../core/common/logger.js'

@injectable()
export class PostgresPool extends pg.Pool {
  public constructor(
    @inject(CORE_COMMON.LOGGER)
    private readonly logger: Logger
  ) {
    super(config.database.postgresPool)

    this.logger.info('Constructing new Postgres Pool')
  }
}
