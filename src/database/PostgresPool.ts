import pg from 'pg'
import { config } from '../config.js'
import { logger } from '../util/logger.js'

export class PostgresPool extends pg.Pool {
  public constructor() {
    super(config.database.postgresPool)

    logger.info('Constructing new Postgres Pool')
  }
}
