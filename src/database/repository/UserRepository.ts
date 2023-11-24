import type { DependencyContainer } from '../../dependency/DependencyContainer.js'
import { PostgresPool } from '../PostgresPool.js'
import type { ReadableRepository, WritableRepository } from '../Repository.js'
import { registerDependency } from '../../dependency/DependencyRegistry.js'

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

@registerDependency({ singleton: true })
export class UserRepository
  implements
    WritableRepository<UserEntity, LoadedUserEntity>,
    ReadableRepository<UserEntityIdentifier, LoadedUserEntity>
{
  private postgresPool: PostgresPool

  public constructor(dc: DependencyContainer) {
    this.postgresPool = dc.resolve(PostgresPool)
  }

  public async getEntity(
    identifier: UserEntityIdentifier
  ): Promise<LoadedUserEntity | undefined> {
    const result = await this.postgresPool.query(
      `
        SELECT * FROM users
        WHERE email = $1
    `,
      [identifier.email]
    )

    return result.rows[0]
  }

  public async setEntity(entity: UserEntity): Promise<LoadedUserEntity> {
    const result = await this.postgresPool.query<LoadedUserEntity>(
      `
        INSERT INTO users (
          name, email, password
        )
        VALUES ($1, $2, $3)
        RETURNING *
        `,
      [entity.name, entity.email, entity.password]
    )

    return result.rows[0]
  }
}
