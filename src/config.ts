import type { PoolConfig } from 'pg'

interface AppConfig{
    database:{
        postgresPool: PoolConfig
    }
}

export const config: AppConfig = {
    database: {
        postgresPool: {}
    }
}