import { ContainerModule } from 'inversify'
import { CoreError } from '../../core/common/errors/CoreError.js'

export abstract class BaseModule extends ContainerModule {
  public constructor() {
    super((bind) => {
      const declarationDependencyMap = new Map(
        this.getDeclarationDependencyMap()
      )

      for (const declarationSymbol of declarationDependencyMap.keys()) {
        const Declaration = declarationDependencyMap.get(declarationSymbol)

        if (!Declaration) {
          throw new CoreError(
            `Cannot start. Missing declaration for the '${String(
              declarationSymbol
            )}' token.`
          )
        }

        bind(declarationSymbol).to(Declaration)
      }
    })
  }

  protected abstract getDeclarationDependencyMap(): [
    symbol,
    new (...args: any[]) => any
  ][]
}
