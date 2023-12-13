import type { CreateUserRequest } from './request/CreateUserRequest.js'
import type { FindUserByIdentifierRequest } from './request/FindUserByIdentifierRequest.js'
import type { User } from '../../entity/User/User.js'

export interface UserRepository {
  save: (entity: CreateUserRequest) => Promise<User>
  getByIdentifier: (
    identifier: FindUserByIdentifierRequest
  ) => Promise<User | undefined>
}
