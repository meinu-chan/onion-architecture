export type DataMapper<TFrom, TTo> = (from: TFrom) => TTo

export function wrapDataMapper<TFrom, TTo>(
  wrapper: DataMapper<TFrom, TTo>
): (from?: TFrom) => TTo {
  return (from?: TFrom): TTo => {
    if (typeof from === 'undefined') return undefined as TTo
    return wrapper(from)
  }
}
