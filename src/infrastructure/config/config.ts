import { configDotenv } from 'dotenv'
import type { PoolConfig } from 'pg'

configDotenv()

interface AppConfig {
  database: {
    postgresPool: PoolConfig
  }
}

export const config: AppConfig = {
  database: {
    postgresPool: {}
  }
}
