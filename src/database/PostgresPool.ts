import pg from 'pg'
import { config } from '../config/config.js'
import type { DependencyContainer } from '../dependency/DependencyContainer.js'
import type { Disposable } from '../dependency/_types.js'
import type { Logger } from 'winston'
import { LOGGER } from '../util/logger.js'
import { registerProcessDependency } from '../dependency/ProcessDependencyContainer.js'

@registerProcessDependency({
  singleton: true,
  disposable: true
})
export class PostgresPool extends pg.Pool implements Disposable {
  public constructor(dc: DependencyContainer) {
    super(config.database.postgresPool)

    const logger = dc.resolve<Logger>(LOGGER)

    logger.info('Constructing new Postgres Pool')
  }

  public async dispose(): Promise<void> {
    await this.end()
  }
}
