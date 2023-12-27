import { getIntegerFromEnv } from '../util/getIntegerFromEnv.js'
import { getRequiredValueFromEnv } from '../util/getRequiredValueFromEnv.js'

interface CoreConfig {
  jwt: { secretToken: string; expiresInMs: number }
}

export const config: CoreConfig = {
  jwt: {
    secretToken: getRequiredValueFromEnv('JWT_SECRET_TOKEN'),
    expiresInMs: getIntegerFromEnv('JWT_EXPIRES_IN_MS') ?? 10 * 60 * 1000 // 10 minutes
  }
}
