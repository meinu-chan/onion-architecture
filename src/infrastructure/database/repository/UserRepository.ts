import type { AddUserDto } from '../../../core/repository/User/dto/AddUserDto.js'
import { inject, injectable } from 'inversify'
import { PostgresPool } from '../PostgresPool.js'
import type { User } from '../../../core/entity/User/User.js'
import type { UserRepository } from '../../../core/repository/User/UserRepository.js'

@injectable()
export class PostgresUserRepository implements UserRepository {
  public constructor(
    @inject(PostgresPool) private readonly postgresPool: PostgresPool
  ) {}

  public async getByIdentifier(identifier: string): Promise<User | undefined> {
    const result = await this.postgresPool.query(
      `
        SELECT * FROM users
        WHERE email = $1
    `,
      [identifier]
    )

    return result.rows[0]
  }

  public async save(entity: AddUserDto): Promise<User> {
    const result = await this.postgresPool.query(
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
