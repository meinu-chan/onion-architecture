import type { AppContainer } from '../../dependency/AppContainer.js'
import { httpTransport } from './http/index.js'
import type { RouteHandler } from '../../api/RouteHandler.js'

export type Routing = {
  [name: string]: {
    [method: string]: new (...args: unknown[]) => RouteHandler
  }
}

export type Transport<TServer = unknown> = (
  routing: Routing,
  port: number,
  container: AppContainer
) => Promise<TServer> | TServer

export const transporters: Record<string, Transport> = {
  http: httpTransport
}
