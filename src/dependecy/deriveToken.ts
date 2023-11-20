import type { DependencyToken, DerivedDependencyToken } from './_types.js'

export function deriveToken(token: DependencyToken): DerivedDependencyToken {
  if (typeof token === 'string' || typeof token === 'symbol') {
    return token
  }

  return token.name
}
