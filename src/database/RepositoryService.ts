import type { DependencyContainer } from '../dependency/DependencyContainer.js'

type ConcreteRepositoryConstructor<TRepository = unknown> = new (
  dc: DependencyContainer
) => TRepository

type AbstractConcreteRepositoryConstructor<TRepository = unknown> =
  abstract new (dc: DependencyContainer) => TRepository

export class RepositoryService {
  public repositories = new Map<string, unknown>()

  public constructor(
    repositories: ConcreteRepositoryConstructor[],
    dc: DependencyContainer
  ) {
    for (const Repository of repositories) {
      this.setRepository(Repository, dc)
    }
  }

  public getRepository<TRepository>(
    repositoryConstructor: AbstractConcreteRepositoryConstructor<TRepository>
  ): TRepository {
    if (this.repositories.has(repositoryConstructor.name)) {
      return this.repositories.get(repositoryConstructor.name)! as TRepository
    }

    throw new UnknownRepositoryError(
      `Repository '${repositoryConstructor.name}' doesn't exist`
    )
  }

  private setRepository(
    repositoryConstructor: ConcreteRepositoryConstructor,
    dc: DependencyContainer
  ): void {
    const generalRepositoryName = this.getAbstractRepositoryName(
      repositoryConstructor
    )

    if (this.repositories.has(generalRepositoryName)) {
      throw new DuplicateRepositoryError(
        `Duplicate of the '${generalRepositoryName}' repository token.`
      )
    }

    this.repositories.set(generalRepositoryName, new repositoryConstructor(dc))
  }

  private getAbstractRepositoryName(
    repositoryConstructor: ConcreteRepositoryConstructor
  ): string {
    const abstractConstructor = Object.getPrototypeOf(
      repositoryConstructor
    ).name

    if (!abstractConstructor) {
      throw new InvalidRepositoryDeclarationError(
        `Repository '${repositoryConstructor.name}' cannot be used without abstract class implementation.`
      )
    }

    return abstractConstructor
  }
}

class UnknownRepositoryError extends Error {}
class DuplicateRepositoryError extends Error {}
class InvalidRepositoryDeclarationError extends Error {}
