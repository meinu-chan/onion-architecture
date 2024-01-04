import { AppError } from '../app/error.js'
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
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return { type: error.type, error: error.message }
      }
      return { type: 'unexpected_error', error: 'Server Internal' }
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

  protected abstract handle(payload: Static<TPayload>): Promise<Static<TReturn>>
  protected abstract getSchema(): RequestSchema
}
