import { AppError } from '../app/error.js'
import type { ErrorResponse } from './error.js'
import type { Static, TAny, TSchema } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import type { ValueError } from '@sinclair/typebox/errors'

export interface BaseSchema {
  Payload: TSchema
  Return: TSchema
}

export interface RequestSchema<TData extends BaseSchema = BaseSchema> {
  readonly payload: TData['Payload']
  readonly return: TData['Return']
}

export interface RequestUtil {
  saveRefreshToken: (refreshToken: string) => Promise<void>
  getAccessToken: () => Promise<string>
  getRefreshToken: () => Promise<string>
  getUser: () => Promise<{ id: number }>
}

export abstract class RouteHandler<
  TPayload extends TSchema = TAny,
  TReturn extends TSchema = TAny
> {
  public async proceedRequest(
    payload: Static<TPayload>,
    util: RequestUtil
  ): Promise<Static<TReturn> | ErrorResponse> {
    try {
      await this.checkAuth(util)

      const validationResult = this.validate(payload)
      if (validationResult) {
        return {
          error_type: 'validation_error',
          error: {
            path: validationResult.path,
            message: validationResult.message,
            value: validationResult.value
          }
        }
      }

      const response = await this.handle(payload, util)
      return this.serialize(response)
    } catch (error: any) {
      if (error instanceof AppError) {
        return {
          error_type: error.type,
          error: error.message
        }
      }
      return {
        error_type: 'unexpected_error',
        error: error.message ?? 'Something went wrong.'
      }
    }
  }

  public validate(incomingData: unknown): ValueError | undefined {
    const { payload: schema } = this.getSchema()
    const errorIterator = Value.Errors(schema, incomingData)
    return errorIterator.First()
  }

  public serialize<Schema extends TSchema>(
    incomingData: unknown
  ): Static<Schema> {
    const { return: schema } = this.getSchema()
    return Value.Cast(schema, incomingData)
  }

  protected async checkAuth(_util: RequestUtil): Promise<void> {
    // Nothing to do
  }

  protected abstract handle(
    payload: Static<TPayload>,
    util: RequestUtil
  ): Promise<Static<TReturn>>
  protected abstract getSchema(): RequestSchema
}
