import type { ReadableRepository, WritableRepository } from '../Repository.js'

export interface UserEntityIdentifier {
  email: string
}

export interface UserEntity extends UserEntityIdentifier {
  id?: number
  name: string
  password: string
}

export interface LoadedUserEntity extends UserEntity {
  id: number
  created_at: Date
  updated_at: Date
}

export abstract class AbstractUserRepository
  implements
    WritableRepository<UserEntity, LoadedUserEntity>,
    ReadableRepository<UserEntityIdentifier, LoadedUserEntity>
{
  public abstract getEntity(
    identifier: UserEntityIdentifier
  ): Promise<LoadedUserEntity | undefined>

  public abstract setEntity(entity: UserEntity): Promise<LoadedUserEntity>
}
