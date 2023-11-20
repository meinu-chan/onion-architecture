import { DependencyContainer } from './DependencyContainer.js'
import { dependencyRegistry } from './DependencyRegistry.js'

class ProcessDependencyContainer extends DependencyContainer {}

export const processDependencyContainer = new ProcessDependencyContainer(
  dependencyRegistry
)
