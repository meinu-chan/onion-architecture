export interface WritableRepository<
  TEntity,
  TLoadedEntity extends TEntity = TEntity
> {
  setEntity(entity: TEntity): Promise<TLoadedEntity>
}

export interface ReadableRepository<TEntityIdentifier, TLoadedEntity> {
  getEntity(identifier: TEntityIdentifier): Promise<TLoadedEntity | undefined>
}

export interface RemovableRepository<TEntityIdentifier> {
  removeEntity(identifier: TEntityIdentifier): Promise<void>
}
