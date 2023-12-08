export function getRequiredValueFromEnv<TValue>(key: string): TValue {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Missing required environment variable '${key}'.`)
  }

  return value as TValue
}
