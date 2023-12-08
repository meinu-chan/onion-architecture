import type { CreateUserRequest } from '../../../core/repository/User/request/CreateUserRequest.js'
import { INFRASTRUCTURE_DATA_MAPPER } from '../../InfrastructureSymbols.js'
import { inject, injectable } from 'inversify'
import { PostgresPool } from '../PostgresPool.js'
import type { User } from '../../../core/entity/User/User.js'
import type { UserDataMapper } from '../mappers/UserMapper.js'
import type { UserRepository } from '../../../core/repository/User/UserRepository.js'

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
    @inject(PostgresPool) private readonly postgresPool: PostgresPool,
    @inject(INFRASTRUCTURE_DATA_MAPPER.USER_DATA_MAPPER)
    private readonly dataMapper: UserDataMapper
  ) {}

  public async getByIdentifier(
    identifier: UserEntityIdentifier
  ): Promise<User | undefined> {
    const result = await this.postgresPool.query<LoadedUserEntity>(
      `
        SELECT * FROM users
        WHERE email = $1
    `,
      [identifier.email]
    )

    return result.rowCount
      ? this.dataMapper.toDomain(result.rows[0])
      : undefined
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

    return this.dataMapper.toDomain(result.rows[0])
  }
}
