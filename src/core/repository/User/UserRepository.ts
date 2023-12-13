import type { CreateUserRequest } from './request/CreateUserRequest.js'
import type { FindUserByUniqueValuesRequest } from './request/FindUserByIdentifierRequest.js'
import type { User } from '../../entity/User/User.js'

export interface UserRepository {
  save: (entity: CreateUserRequest) => Promise<User>
  getByUniqueValue: (
    uniqueValues: FindUserByUniqueValuesRequest
  ) => Promise<User | undefined>
  getById: (id: number) => Promise<User | undefined>
}
