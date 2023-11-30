import type { DependencyContainer } from '../dependency/DependencyContainer.js'
import type { RepositoryService } from './RepositoryService.js'
import { UserRepository } from './repository/UserRepository.js'

export class PostgresDataService implements RepositoryService {
  public userRepository: UserRepository

  public constructor(dc: DependencyContainer) {
    this.userRepository = new UserRepository(dc)
  }
}
