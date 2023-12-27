type CoreErrorType =
  | 'entity_duplicate'
  | 'invalid_data'
  | 'not_found'
  | 'unauthorized'
  | 'core'

export class CoreError extends Error {
  public type: CoreErrorType

  public constructor(message: string, type: CoreErrorType = 'core') {
    super(message)
    this.type = type
  }
}
