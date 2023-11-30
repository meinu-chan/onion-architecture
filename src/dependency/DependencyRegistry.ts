import type { DependencyDeclaration, DependencyToken, DerivedDependencyToken } from './_types.js'
import { deriveToken } from './deriveToken.js'

export class DependencyRegistry extends Map<
  DerivedDependencyToken,
  DependencyDeclaration
> {
  public get<TInstance>(
    token: DependencyToken | DerivedDependencyToken
  ): DependencyDeclaration<TInstance> {
    const derivedToken = deriveToken(token)

    const declaration = super.get(derivedToken)

    if (declaration) {
      return declaration
    }

    throw new Error(
      `No dependency is registered for token '${derivedToken.toString()}'.`
    )
  }

  public set(token: DependencyToken, declaration: DependencyDeclaration): this {
    const derivedToken = deriveToken(token)

    if (super.has(derivedToken)) {
      throw new Error(
        `${
          this.constructor.name
        } already has an entry for token '${derivedToken.toString()}'`
      )
    }

    return super.set(derivedToken, declaration)
  }
}

export const dependencyRegistry = new DependencyRegistry()
