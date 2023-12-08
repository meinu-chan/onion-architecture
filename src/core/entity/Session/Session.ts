export class Session {
  public constructor(
    public readonly user_id: number,
    public readonly refresh_token: string,
    public readonly created_at: Date,
    public readonly updated_at: Date
  ) {}
}
