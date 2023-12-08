import type { Session } from '../../../entity/Session/Session.js'

export interface SessionWithAccessToken extends Session {
  readonly accessToken: string
}
