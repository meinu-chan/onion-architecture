export const CORE_REPOSITORY = {
  USER_REPOSITORY: Symbol.for('UserRepository'),
  SESSION_REPOSITORY: Symbol.for('SessionRepository')
}

export const CORE_SERVICE = {
  PASSWORD_SERVICE: Symbol.for('PasswordService'),
  JWT_SERVICE: Symbol.for('JWTService')
}

export const CORE_COMMON = {
  LOGGER: Symbol.for('Logger')
}
