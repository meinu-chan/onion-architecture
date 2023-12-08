import type { Session } from '../../../entity/Session/Session.js'

export class SessionWithAccessTokenDto implements Session {
  public constructor(
    public readonly access_token: string,
    public readonly user_id: number,
    public readonly refresh_token: string,
    public readonly created_at: Date,
    public readonly updated_at: Date
  ) {}
}
