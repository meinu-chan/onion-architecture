import { importDirectory } from '../lib/loader.js'
import type { interfaces } from 'inversify'
import type { RouteHandler } from './RouteHandler.js'
import type { Routing } from '../lib/transport/index.js'
import { set } from '../lib/util/set.js'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export interface RouteHandlerListItem {
  handler: new (...args: any[]) => RouteHandler
  path: string
}

export async function initApiRouting(
  container: interfaces.Container
): Promise<Routing> {
  const api: Routing = {}
  const fileName = fileURLToPath(import.meta.url)
  const apiFolderPath = join(dirname(fileName), 'routing')
  const imported =
    await importDirectory<RouteHandlerListItem['handler']>(apiFolderPath)

  for (const { data, path } of Object.values(imported)) {
    container.bind<RouteHandler>(data).toSelf()
    set(api, path, data, '/')
  }

  return api
}
