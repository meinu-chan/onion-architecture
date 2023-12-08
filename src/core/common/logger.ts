import { createLogger, type Logger as WinstonLogger, transports } from 'winston'

export type Logger = WinstonLogger

export function loggerFactory(): Logger {
  return createLogger({
    transports: [new transports.Console()]
  })
}
