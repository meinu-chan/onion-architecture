export function getIntegerFromEnv(
  key: string,
  fallback?: number
): number | undefined {
  const value = process.env[key]

  if (value) {
    const integer = parseInt(value, 10)

    if (isFinite(integer)) {
      return integer
    }
  }

  return fallback
}
