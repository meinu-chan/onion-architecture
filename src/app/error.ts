export type AppErrorType = (typeof appErrorTypes)[number]

export const appErrorTypes = ['duplicate'] as const

export class AppError extends Error {
  public readonly type: AppErrorType

  public constructor(message: string, type: AppErrorType) {
    super(message)

    this.type = type
  }
}
