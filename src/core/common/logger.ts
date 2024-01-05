import { join } from 'path'
import {
  createLogger,
  type Logger as WinstonLogger,
  transports,
  format
} from 'winston'

export type Logger = WinstonLogger

export function loggerFactory(): Logger {
  return createLogger({
    transports: [
      new transports.Console({ format: format.cli() }),
      new transports.File({
        format: format.combine(format.timestamp(), errorFormat),
        dirname: join(process.cwd(), './log'),
        filename: 'error.log',
        maxsize: 10 * 2 ** 20, // 10MB
        level: 'error'
      })
    ]
  })
}

const errorFormat = format.printf(({ message, timestamp }) => {
  return `${timestamp}\t${message}`
})
