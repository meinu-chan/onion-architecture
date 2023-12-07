import { configDotenv } from 'dotenv'
import type { PoolConfig } from 'pg'

configDotenv()

interface InfrastructureConfig {
  database: {
    postgresPool: PoolConfig
  }
}

export const infrastructureConfig: InfrastructureConfig = {
  database: {
    postgresPool: {}
  }
}
