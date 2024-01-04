type AppErrorType = 'duplicate'

export class AppError extends Error {
  public constructor(
    message: string,
    public readonly type: AppErrorType
  ) {
    super(message)
  }
}
