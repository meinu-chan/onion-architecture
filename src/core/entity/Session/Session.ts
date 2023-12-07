export class Session {
  public constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string
  ) {}
}
