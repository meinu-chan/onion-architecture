import type { CreateUserRequest } from '../../../core/repository/user/request/CreateUserRequest.js'
import { inject, injectable } from 'inversify'
import { PostgresPool } from '../PostgresPool.js'
import type { User } from '../../../core/model/user/index.js'
import { userDataMapper } from '../mappers/user.js'
import type { UserRepository } from '../../../core/repository/user/index.js'

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

@injectable()
export class PostgresUserRepository implements UserRepository {
  public constructor(
    @inject(PostgresPool) private readonly postgresPool: PostgresPool
  ) {}

  public async getById(id: number): Promise<User | undefined> {
    const result = await this.postgresPool.query<LoadedUserEntity>(
      `
        SELECT * FROM users
        WHERE id = $1
      `,
      [id]
    )

    return userDataMapper(result.rows[0])
  }

  // TODO: add filter builder
  public async getOne(
    identifier: UserEntityIdentifier
  ): Promise<User | undefined> {
    const result = await this.postgresPool.query<LoadedUserEntity>(
      `
        SELECT * FROM users
        WHERE email = $1
    `,
      [identifier.email]
    )

    return userDataMapper(result.rows[0])
  }

  public async save(entity: CreateUserRequest): Promise<User> {
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

    return userDataMapper(result.rows[0])
  }
}
