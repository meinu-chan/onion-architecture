import { httpTransport } from './http.js'
import type { interfaces } from 'inversify'
import type { RouteHandler } from '../api/RouteHandler.js'

export type Routing = {
  [name: string]: {
    [method: string]: new (...args: unknown[]) => RouteHandler
  }
}

export type Transport<TServer = unknown> = (
  routing: Routing,
  port: number,
  container: interfaces.Container
) => Promise<TServer> | TServer

export const transporters: Record<string, Transport> = {
  http: httpTransport
}
