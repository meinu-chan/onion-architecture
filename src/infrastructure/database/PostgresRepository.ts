interface CommonRepositoryEntity {
  EntityIdentifier?: unknown
  Entity?: unknown
  LoadedEntity?: unknown
}

export interface Repository<TEntity extends CommonRepositoryEntity = any> {
  getEntity?: (
    identifier: TEntity['EntityIdentifier']
  ) => Promise<TEntity['LoadedEntity'] | undefined>
  getEntities?: () => Promise<TEntity['LoadedEntity'][]>
  setEntity?: (entity: TEntity['Entity']) => Promise<TEntity['LoadedEntity']>
  removeEntity?: (identifier: TEntity['EntityIdentifier']) => Promise<void>
  updateEntity?: (
    identifier: TEntity['EntityIdentifier'],
    entity: TEntity['Entity']
  ) => Promise<TEntity['LoadedEntity']>
}

type PartialRepository<
  TEntity extends CommonRepositoryEntity = CommonRepositoryEntity,
  TMethods extends keyof Repository<TEntity> = keyof Repository<TEntity>
> = Required<Pick<Repository<TEntity>, TMethods>>

export type WritableRepository<
  TEntity,
  TLoadedEntity extends TEntity = TEntity
> = PartialRepository<
  { Entity: TEntity; LoadedEntity: TLoadedEntity },
  'setEntity'
>

export type ReadableRepository<
  TEntityIdentifier,
  TLoadedEntity extends TEntityIdentifier
> = PartialRepository<
  {
    EntityIdentifier: TEntityIdentifier
    LoadedEntity: TLoadedEntity
  },
  'getEntity'
>

export type RemovableRepository<TEntityIdentifier> = PartialRepository<
  { EntityIdentifier: TEntityIdentifier },
  'removeEntity'
>
