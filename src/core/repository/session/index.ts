import type { SaveSessionRequest } from './request/SaveSessionRequest.js'
import type { Session } from '../../model/session/index.js'

export interface SessionRepository {
  save: (entity: SaveSessionRequest) => Promise<Session>
  updateByRefreshToken: (refreshToken: string) => Promise<Session>

  findByRefreshToken: (refreshToken: string) => Promise<Session | undefined>
  countByUser: (userId: number) => Promise<number>

  removeByRefreshToken: (refreshToken: string) => Promise<void>
}
