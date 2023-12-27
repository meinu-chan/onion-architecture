import { configDotenv } from 'dotenv'
import type { CoreConfig } from './core/common/config.js'
import { getIntegerFromEnv } from './util/getIntegerFromEnv.js'
import { getRequiredValueFromEnv } from './util/getRequiredValueFromEnv.js'
import type { PoolConfig } from 'pg'

configDotenv()

export interface InfrastructureConfig {
  database: {
    postgresPool: PoolConfig
  }
}

export interface PresentationConfig {
  session: {
    maxAge: number
  }
}

interface Config {
  infrastructure: InfrastructureConfig
  presentation: PresentationConfig
  core: CoreConfig
}

export const config: Config = {
  infrastructure: {
    database: {
      postgresPool: {}
    }
  },
  presentation: {
    session: { maxAge: getIntegerFromEnv('SESSION_TOKEN_MAX_AGE', 10) }
  },
  core: {}
}
