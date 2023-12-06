import type { AddUserDto } from './dto/AddUserDto.js'
import type { User } from '../../entity/User/User.js'

export interface UserRepository {
  save(dto: AddUserDto): Promise<User>
  getByIdentifier(email: string): Promise<User | undefined>
}
