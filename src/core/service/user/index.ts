import type { CreateUserRequest } from '../../repository/user/request/CreateUserRequest.js'
import type { FindUserByUniqueValuesRequest } from '../../repository/user/request/FindUserByIdentifierRequest.js'
import type { User } from '../../model/user/index.js'

export interface UserService {
  save(request: CreateUserRequest): Promise<User>
  getOne(identifier: FindUserByUniqueValuesRequest): Promise<User | undefined>
  getById(id: number): Promise<User | undefined>
}
