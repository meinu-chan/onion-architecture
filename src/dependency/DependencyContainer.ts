import type {
  DependencyDeclaration,
  DependencyToken,
  DerivedDependencyToken,
  Disposable
} from './_types.js'
import type { DependencyRegistry } from './DependencyRegistry.js'
import { deriveToken } from './deriveToken.js'

export abstract class DependencyContainer implements Disposable {
  protected readonly disposables: Set<Disposable> = new Set()
  protected readonly singletons: Map<DerivedDependencyToken, unknown> =
    new Map()

  public constructor(private registry: DependencyRegistry) {}

  public async dispose(): Promise<void> {
    const promises = []

    for (const disposable of this.disposables) {
      promises.push(disposable.dispose())
    }

    this.disposables.clear()
    this.singletons.clear()

    await Promise.all(promises)
  }

  public resolve<TInstance>(token: DependencyToken<TInstance>): TInstance {
    return this.resolveWithDeclaration<TInstance>(
      token,
      this.registry.get(token)
    )
  }

  protected resolveWithDeclaration<TInstance>(
    token: DependencyToken,
    declaration: DependencyDeclaration<TInstance>
  ): TInstance {
    const derivedToken = deriveToken(token)

    if (declaration.singleton && this.singletons.has(derivedToken)) {
      return this.singletons.get(derivedToken) as TInstance
    }

    return this.createInstance(derivedToken, declaration)
  }

  private createInstance<TInstance>(
    token: DerivedDependencyToken,
    declaration: DependencyDeclaration<TInstance>
  ): TInstance {
    let instance: TInstance

    if ('useClass' in declaration) {
      instance = new declaration.useClass(this)
    } else if ('useFactory' in declaration) {
      instance = declaration.useFactory(this)
    } else {
      throw new Error(`Cannot register instance by '${token.toString()}' token`)
    }

    if (declaration.disposable) {
      this.disposables.add(instance as Disposable)
    }

    if (declaration.singleton) {
      this.singletons.set(token, instance)
    }

    return instance
  }
}
