import type { Session } from '../../../model/session/index.js'

export interface SessionWithAccessToken extends Session {
  readonly accessToken: string
}
