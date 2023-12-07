interface CoreErrorMetadata {
  unhandledError?: boolean
  reason: 'default' | 'duplicate'
}

export class CoreError extends Error {
  public metadata: CoreErrorMetadata

  public constructor(
    message: string,
    metadata: CoreErrorMetadata = { unhandledError: true, reason: 'default' }
  ) {
    super(message)

    this.metadata = metadata
  }
}
