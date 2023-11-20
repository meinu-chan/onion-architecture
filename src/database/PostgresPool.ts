import pg from 'pg'
import { config } from '../config.js'
import type { DependencyContainer } from '../dependecy/DependencyContainer.js'
import type { Disposable } from '../dependecy/_types.js'
import type { Logger } from 'winston'
import { LOGGER } from '../util/logger.js'
import { registerDependency } from '../dependecy/DependencyRegistry.js'

@registerDependency({
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
