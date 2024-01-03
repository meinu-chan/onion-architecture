#!/usr/bin/env node

import 'reflect-metadata'
import pg from 'pg'
import Postgrator from 'postgrator'
import { AppContainer } from '../dependency/AppContainer.js'
import { config } from '../config.js'
import { CORE_COMMON } from '../core/CoreSymbols.js'
import type { Logger } from '../core/common/logger.js'

import { join } from 'node:path'

async function runUpMigrations(targetMigration: string) {
  const dbConfig = config.database.postgresPool
  const logger = new AppContainer().get<Logger>(CORE_COMMON.LOGGER)
  const client = new pg.Client(dbConfig)

  const pathToMigrations = join(
    process.cwd(),
    'database',
    'migrations',
    '*.sql'
  )

  await client.connect()

  const postgrator = new Postgrator({
    driver: 'pg',
    migrationPattern: pathToMigrations,
    execQuery: (query) => client.query(query),
    schemaTable: 'schema_version'
  })

  const appliedMigrations = await postgrator.migrate(targetMigration)

  for (const migration of appliedMigrations) {
    logger.info(
      `Migration #${migration.version} (${migration.name}) ${
        migration.action === 'do' ? 'DONE' : 'UNDONE'
      }.`
    )
  }

  logger.info(`Ran ${appliedMigrations.length} PostgreSQL migrations.`)

  void client.end()
}

void runUpMigrations('max')
