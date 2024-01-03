import type { SessionWithAccessToken } from '../../repository/session/request/SessionWithAccessTokenRequest.js'

export interface SessionService {
  create(request: number): Promise<SessionWithAccessToken>
  restore(request: string): Promise<SessionWithAccessToken>
  remove(request: string): Promise<void>
}
