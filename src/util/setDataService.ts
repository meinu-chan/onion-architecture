import type { DependencyContainer } from '../dependency/DependencyContainer.js'
import { dependencyRegistry } from '../dependency/DependencyRegistry.js'
import { RepositoryService } from '../database/RepositoryService.js'

export function setDataService(
  dataService: new (dc: DependencyContainer) => RepositoryService
): void {
  dependencyRegistry.set(RepositoryService, {
    useClass: dataService,
    singleton: true
  })
}
