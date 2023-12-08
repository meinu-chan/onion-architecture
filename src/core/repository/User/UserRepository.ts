import type { AddUserDto } from './dto/AddUserDto.js'
import type { FindUserByIdentifierDto } from './dto/FindUserByIdentifierDto.js'
import type { User } from '../../entity/User/User.js'

export interface UserRepository {
  save: (dto: AddUserDto) => Promise<User>
  getByIdentifier: (
    identifier: FindUserByIdentifierDto
  ) => Promise<User | undefined>
}
