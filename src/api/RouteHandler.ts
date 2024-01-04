import { ApiError } from './error/ApiError.js'
import type { ErrorResponse } from './error.js'
import type { Static, TSchema } from '@sinclair/typebox'
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

export abstract class RouteHandler<
  TPayload extends TSchema = TSchema,
  TReturn extends TSchema = TSchema
> {
  public async proceedRequest(
    payload: Static<TPayload>
  ): Promise<Static<TReturn> | ErrorResponse> {
    const validationResult = this.validate(payload)
    if (validationResult) {
      return {
        type: 'validation_error',
        error: {
          path: validationResult.path,
          message: validationResult.message,
          value: validationResult.value
        }
      }
    }

    try {
      const response = await this.handle(payload)
      return this.serialize(response)
    } catch (error) {
      return {
        type: 'caught_error',
        error: ApiError.from(error)
      }
    }
  }

  public validate(incomingData: unknown): ValueError | undefined {
    const errorIterator = Value.Errors(this.getSchema().payload, incomingData)
    return errorIterator.First()
  }

  public serialize<Schema extends TSchema>(
    incomingData: unknown
  ): Static<Schema> {
    return Value.Cast(this.getSchema().return, incomingData)
  }

  protected abstract handle(payload: Static<TPayload>): Promise<Static<TReturn>>
  protected abstract getSchema(): RequestSchema
}
