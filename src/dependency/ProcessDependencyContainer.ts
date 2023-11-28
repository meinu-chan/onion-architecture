import type {
  DependencyConstructor,
  DependencyDeclarationCommonOptions
} from './_types.js'
import { DependencyContainer } from './DependencyContainer.js'
import { dependencyRegistry } from './DependencyRegistry.js'

class ProcessDependencyContainer extends DependencyContainer {}

export const processDependencyContainer = new ProcessDependencyContainer(
  dependencyRegistry
)

export function registerProcessDependency(
  declarationOptions: DependencyDeclarationCommonOptions
) {
  return (target: DependencyConstructor<unknown>) => {
    dependencyRegistry.set(target, {
      useClass: target,
      scope: 'process',
      ...declarationOptions
    })
  }
}
