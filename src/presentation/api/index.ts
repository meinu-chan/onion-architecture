import { ApiError } from '../error/ApiError.js'
import type { interfaces } from 'inversify'
import { loadDirectory } from '../loader.js'
import type { Routing } from '../../lib/transport/index.js'
import { set } from '../../util/set.js'
import { Value, ValueError } from '@sinclair/typebox/value'
import { Type, type Static, type TSchema } from '@sinclair/typebox'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { STATUS_CODES } from 'node:http'

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

interface ErrorResponse {
  status: string
  code: number
  error: {
    path?: string
    message: string
    value?: unknown
  }
}

export abstract class RouteHandler<
  TBaseSchema extends BaseSchema = BaseSchema,
  TReturn = any
> {
  public validate(
    incomingData: unknown,
    schema: TSchema
  ): ValueError | undefined {
    const errorIterator = Value.Errors(schema, incomingData)

    return errorIterator.First()
  }

  public serialize<TSerialized>(
    incomingData: unknown,
    schema: TSchema
  ): TSerialized {
    return Value.Cast(schema, incomingData) as TSerialized
  }

  public async proceedRequest(
    payload: RequestPayload<Omit<TBaseSchema, 'Response'>>
  ): Promise<TReturn | ErrorResponse> {
    const schema = this.getSchema()

    const validationResult = this.validate(
      payload,
      Type.Object({
        body: schema.body ?? Type.Undefined(),
        query: schema.query ?? Type.Undefined()
      })
    )

    if (validationResult) {
      return {
        status: STATUS_CODES[400]!,
        code: 400,
        error: {
          path: validationResult.path,
          message: validationResult.message,
          value: validationResult.value
        }
      }
    }

    try {
      const response = await this.handle(payload)
      if (schema.response) {
        return this.serialize(
          { ...response, blub: 'random-stuff' },
          schema.response
        )
      }
      return response
    } catch (error) {
      const apiError = ApiError.from(error)

      return {
        code: apiError.statusCode,
        status: apiError.status,
        error: { message: apiError.message }
      }
    }
  }

  protected abstract handle(
    payload: RequestPayload<Omit<TBaseSchema, 'Response'>>
  ): Promise<TReturn> | TReturn

  protected abstract getSchema(): RequestSchema<TBaseSchema>
}

export async function initApiRouting(
  container: interfaces.Container
): Promise<Routing> {
  const apiFolderPath = dirname(fileURLToPath(import.meta.url))

  const api: Routing = {}
  const imported =
    await loadDirectory<new (...args: any[]) => RouteHandler>(apiFolderPath)

  for (const { data, path } of Object.values(imported)) {
    container.bind<RouteHandler>(data).toSelf()
    set(api, path, data, '/')
  }

  return api
}
