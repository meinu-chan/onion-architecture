export interface Session {
  readonly userId: number
  readonly refreshToken: string
  readonly createdAt: Date
  readonly updatedAt: Date
}
