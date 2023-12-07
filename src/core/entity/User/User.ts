export class User {
  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly created_at: Date
  ) {}
}
