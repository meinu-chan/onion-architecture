import { ApiError } from '../error/ApiError.js'
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
  public validate(
    incomingData: unknown,
    schema: TSchema
  ): ValueError | undefined {
    const errorIterator = Value.Errors(schema, incomingData)

    return errorIterator.First()
  }

  public serialize<Schema extends TSchema>(
    incomingData: unknown,
    schema: Schema
  ): Static<Schema> {
    return Value.Cast(schema, incomingData)
  }

  public async proceedRequest(
    payload: Static<TPayload>
  ): Promise<Static<TReturn> | ErrorResponse> {
    const schema = this.getSchema()
    const validationResult = this.validate(payload, schema.payload)
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
      return this.serialize(response, schema.return)
    } catch (error) {
      const apiError = ApiError.from(error)
      return {
        type: 'caught_error',
        error: apiError
      }
    }
  }

  protected abstract handle(payload: Static<TPayload>): Promise<Static<TReturn>>

  protected abstract getSchema(): RequestSchema
}
