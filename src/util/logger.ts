import { dependencyRegistry } from '../dependency/DependencyRegistry.js'
import { createLogger, type Logger as WinstonLogger, transports } from 'winston'

export type Logger = WinstonLogger

export const LOGGER = Symbol('Winston-Logger')

function loggerFactory() {
  return createLogger({ transports: [new transports.Console()] })
}

dependencyRegistry.set(LOGGER, {
  useFactory: loggerFactory,
  singleton: true
})
