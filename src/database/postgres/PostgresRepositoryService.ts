import type { DependencyContainer } from '../../dependency/DependencyContainer.js'
import { postgresRepositories } from './repository/_list.js'
import { RepositoryService } from '../RepositoryService.js'

export class PostgresDataService extends RepositoryService {
  public constructor(dc: DependencyContainer) {
    super(postgresRepositories, dc)
  }
}
