import { ContainerModule } from 'inversify'

export type DependencyDeclaration = [symbol, new (...args: any[]) => any]

export abstract class BaseModule extends ContainerModule {
  public constructor() {
    super((bind) => {
      const declarationDependencyMap = new Map(
        this.getDeclarationDependencyMap()
      )

      for (const declarationSymbol of declarationDependencyMap.keys()) {
        const Declaration = declarationDependencyMap.get(declarationSymbol)

        if (!Declaration) {
          throw new Error(
            `Missing declaration for the '${String(declarationSymbol)}' token.`
          )
        }

        bind(declarationSymbol).to(Declaration)
      }
    })
  }

  protected abstract getDeclarationDependencyMap(): DependencyDeclaration[]
}
