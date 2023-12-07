import type { SignInDto } from './dto/SignInDto.js'
import type { SignUpDto } from './dto/SignUpDto.js'
import type { User } from '../../entity/User/User.js'

export interface SessionRepository {
  signIn: (dto: SignInDto) => Promise<User>
  signUp: (dto: SignUpDto) => Promise<User>

  logOut: () => Promise<void>
}
