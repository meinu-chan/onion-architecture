import { AbstractUserRepository, LoadedUserEntity, UserEntity, UserEntityIdentifier } from '../abstract/AbstractUserRepository.js'
import type { DependencyContainer } from '../../dependency/DependencyContainer.js'
import { PostgresPool } from '../PostgresPool.js'

export class UserRepository extends AbstractUserRepository {
  private postgresPool: PostgresPool

  public constructor(dc: DependencyContainer) {
    super()

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
