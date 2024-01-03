import { configDotenv } from 'dotenv'
import { getIntegerFromEnv } from './util/getIntegerFromEnv.js'
import { getRequiredValueFromEnv } from './util/getRequiredValueFromEnv.js'
import type { PoolConfig } from 'pg'

configDotenv()

interface Config {
  app: {
    transport: 'HTTP'
    host: string
  }
  database: {
    postgresPool: PoolConfig
  }
  session: {
    maxAge: number
  }
  jwt: {
    secretToken: string
    expiresInMs: number
  }
}

export const config: Config = {
  app: {
    transport: 'HTTP',
    host: process.env.APP_HOST ?? '0.0.0.0'
  },
  database: {
    postgresPool: {}
  },
  session: { maxAge: getIntegerFromEnv('SESSION_TOKEN_MAX_AGE') ?? 10 },
  jwt: {
    secretToken: getRequiredValueFromEnv('JWT_SECRET_TOKEN'),
    expiresInMs: getIntegerFromEnv('JWT_EXPIRES_IN_MS') ?? 10 * 60 * 1000 // 10 minutes
  }
}
