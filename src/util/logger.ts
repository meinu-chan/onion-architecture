import { createLogger, transports } from 'winston'
import { dependencyRegistry } from '../dependecy/DependencyRegistry.js'

export const LOGGER = Symbol('Winston-Logger')

function loggerFactory() {
  return createLogger({ transports: [new transports.Console()] })
}

dependencyRegistry.set(LOGGER, {
  useFactory: loggerFactory,
  singleton: true
})
