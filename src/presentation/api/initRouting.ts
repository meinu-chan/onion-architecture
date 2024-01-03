import { _list as sessionHandlers } from './session/_list.js'
import type { interfaces } from 'inversify'
import type { RouteHandler } from './RouteHandler.js'
import type { Routing } from '../transport/index.js'
import { set } from '../../util/set.js'

export interface RouteHandlerListItem {
  handler: new (...args: any[]) => RouteHandler
  path: string
}

const handlers: RouteHandlerListItem[] = [...sessionHandlers]

export function initApiRouting(container: interfaces.Container): Routing {
  const api: Routing = {}
  for (const { handler, path } of Object.values(handlers)) {
    container.bind<RouteHandler>(handler).toSelf()
    set(api, path, handler, '/')
  }
  return api
}
