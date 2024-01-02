import type { interfaces } from 'inversify'
import { loadDirectory } from '../loader.js'
import type { Routing } from '../../lib/transport/index.js'
import { set } from '../../util/set.js'
import type { Static, TSchema } from '@sinclair/typebox'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export interface BaseSchema {
  Body?: TSchema
  Query?: TSchema
  Response?: TSchema
}

export interface RequestSchema<TData extends BaseSchema = BaseSchema> {
  readonly body?: TData['Body']
  readonly query?: TData['Query']
  readonly response?: TData['Response']
}

export type RequestPayload<
  TRequestSchema extends Omit<BaseSchema, 'Response'>
> = {
  readonly [K in Extract<keyof TRequestSchema, string> as Lowercase<K>]: Static<
    Extract<TRequestSchema[K], TSchema>
  >
}

export interface RouteHandler<
  TBaseSchema extends BaseSchema = BaseSchema,
  TReturn = unknown
> {
  handle(
    payload: RequestPayload<Omit<TBaseSchema, 'Response'>>
  ): Promise<TReturn> | TReturn
  getSchema(): RequestSchema<TBaseSchema>
}

export async function initApiRouting(
  container: interfaces.Container
): Promise<Routing> {
  const apiFolderPath = dirname(fileURLToPath(import.meta.url))

  const api: Routing = {}
  const imported = await loadDirectory<{
    handler: new (...args: any[]) => RouteHandler
  }>(apiFolderPath)

  for (const { data, path } of Object.values(imported)) {
    container.bind<RouteHandler>(data.handler).toSelf()
    set(api, path, data.handler, '/')
  }

  return api
}
