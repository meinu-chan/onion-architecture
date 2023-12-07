export interface DataMapper<TDomainEntity = any, TDatabaseEntity = any> {
  toDomain: (entity: TDatabaseEntity) => TDomainEntity
}
