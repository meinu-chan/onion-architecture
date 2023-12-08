export class SignInDto {
  public constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}
