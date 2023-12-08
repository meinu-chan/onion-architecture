import type { SaveSessionDto } from './dto/SaveSessionDto.js'
import type { Session } from '../../entity/Session/Session.js'

export interface SessionRepository {
  save: (dto: SaveSessionDto) => Promise<Session>
  updateByRefreshToken: (refreshToken: string) => Promise<Session>

  findByRefreshToken: (refreshToken: string) => Promise<Session | undefined>
  countByUser: (userId: number) => Promise<number>

  removeByRefreshToken: (refreshToken: string) => Promise<void>
}
