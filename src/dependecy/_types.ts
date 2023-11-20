import type { DependencyContainer } from './DependencyContainer.js'

export type DependencyConstructor<TDependency> =
  | (new (dc: DependencyContainer) => TDependency)
  | (new () => TDependency)

export interface DependencyDeclarationCommonOptions {
  disposable?: boolean
  singleton?: boolean
}

interface FactoryDependencyDeclaration<TDeclaration>
  extends DependencyDeclarationCommonOptions {
  useFactory: (dc: DependencyContainer) => TDeclaration
}

interface SimpleClassDependencyDeclaration<TInstance>
  extends DependencyDeclarationCommonOptions {
  useClass: DependencyConstructor<TInstance>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DependencyDeclaration<TInstance = any> =
  | FactoryDependencyDeclaration<TInstance>
  | SimpleClassDependencyDeclaration<TInstance>

export type DependencyToken<TInstance = unknown> =
  | DerivedDependencyToken
  | DependencyConstructor<TInstance>

export type DerivedDependencyToken = string | symbol

export interface Disposable {
  dispose(): Promise<void> | void
}
