export class SaveSessionDto {
  public constructor(
    public readonly refreshToken: string,
    public readonly userId: number
  ) {}
}
