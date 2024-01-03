import type { LogOutRequest } from './request/LogOutRequest.js'
import type { SessionWithAccessToken } from '../../repository/session/request/SessionWithAccessTokenRequest.js'
import type { SignInRequest } from './request/SignInRequest.js'
import type { SignUpRequest } from './request/SignUpRequest.js'

export interface AuthService {
  signIn(request: SignInRequest): Promise<SessionWithAccessToken>
  signUp(request: SignUpRequest): Promise<SessionWithAccessToken>
  logOut(request: LogOutRequest): Promise<void>
}
