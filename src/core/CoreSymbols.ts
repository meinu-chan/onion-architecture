export const CORE_REPOSITORY = {
  USER_REPOSITORY: Symbol.for('UserRepository'),
  SESSION_REPOSITORY: Symbol.for('SessionRepository')
}

export const CORE_SERVICE = {
  USER_SERVICE: Symbol.for('UserService'),
  SESSION_SERVICE: Symbol.for('SessionService'),
  PASSWORD_SERVICE: Symbol.for('PasswordService'),
  AUTH_SERVICE: Symbol.for('AuthenticationService'),
  JWT_SERVICE: Symbol.for('JWTService')
}

export const CORE_COMMON = {
  LOGGER: Symbol.for('Logger')
}
