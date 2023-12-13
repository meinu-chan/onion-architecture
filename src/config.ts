import { configDotenv } from 'dotenv'
import { getIntegerFromEnv } from './util/getIntegerFromEnv.js'
import type { PoolConfig } from 'pg'

configDotenv()

export interface InfrastructureConfig {
  database: {
    postgresPool: PoolConfig
  }
}

export interface PresentationConfig {
  session: {
    maxAge?: number
  }
}

interface Config {
  infrastructure: InfrastructureConfig
  presentation: PresentationConfig
}

export const config: Config = {
  infrastructure: {
    database: {
      postgresPool: {}
    }
  },
  presentation: {
    session: { maxAge: getIntegerFromEnv('SESSION_TOKEN_MAX_AGE') ?? 10 }
  }
}
