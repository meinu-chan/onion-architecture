export interface JWTService {
  createAccessToken: (id: number) => Promise<string>
  verifyAccessToken: (
    token: string
  ) => Promise<{ id: number; expired: boolean } | false>
  createRefreshToken: () => Promise<string>
}
