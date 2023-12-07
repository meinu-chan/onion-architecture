// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DataMapper<TDomainEntity = any, TDatabaseEntity = any> {
  toDomain: (entity: TDatabaseEntity) => TDomainEntity
}
