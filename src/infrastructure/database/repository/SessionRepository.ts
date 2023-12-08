import { INFRASTRUCTURE_DATA_MAPPER } from '../../InfrastructureSymbols.js'
import { inject, injectable } from 'inversify'
import { PostgresPool } from '../PostgresPool.js'
import type { SaveSessionDto } from '../../../core/repository/Session/dto/SaveSessionDto.js'
import type { Session } from '../../../core/entity/Session/Session.js'
import type { SessionDataMapper } from '../mappers/SessionMapper.js'
import type { SessionRepository } from '../../../core/repository/Session/SessionRepository.js'

export interface SessionEntityIdentifier {
  refresh_token: string
}

export interface SessionEntity extends SessionEntityIdentifier {
  user_id: number
}

export interface LoadedSessionEntity extends SessionEntity {
  created_at: Date
  updated_at: Date
}

@injectable()
export class PostgresSessionRepository implements SessionRepository {
  public constructor(
    @inject(PostgresPool) private readonly postgresPool: PostgresPool,
    @inject(INFRASTRUCTURE_DATA_MAPPER.SESSION_DATA_MAPPER)
    private readonly dataMapper: SessionDataMapper
  ) {}

  public async save(entity: SaveSessionDto): Promise<Session> {
    const result = await this.postgresPool.query<LoadedSessionEntity>(
      `
            INSERT INTO sessions (
              refresh_token, user_id
            )
            VALUES ($1, $2)
            RETURNING *
            `,
      [entity.refreshToken, entity.userId]
    )

    return this.dataMapper.toDomain(result.rows[0])
  }

  public async updateByRefreshToken(refreshToken: string): Promise<Session> {
    const result = await this.postgresPool.query<LoadedSessionEntity>(
      `
        UPDATE sessions
        WHERE refresh_token = $1
        SET updated_at = transaction_timestamp()
        RETURNING *
        `,
      [refreshToken]
    )

    return result.rows[0]
  }

  public async findByRefreshToken(
    refreshToken: string
  ): Promise<Session | undefined> {
    const result = await this.postgresPool.query<LoadedSessionEntity>(
      `
        SELECT * FROM sessions
        WHERE refresh_token = $1
        `,
      [refreshToken]
    )

    return result.rows[0]
  }

  public async countByUser(userId: number): Promise<number> {
    const result = await this.postgresPool.query<LoadedSessionEntity>(
      `
        SELECT * FROM sessions
        WHERE user_id = $1
        `,
      [userId]
    )

    return result.rowCount ?? 0
  }

  public async removeByRefreshToken(refreshToken: string): Promise<void> {
    await this.postgresPool.query<LoadedSessionEntity>(
      `
        DELETE FROM sessions
        WHERE refresh_token = $1
        `,
      [refreshToken]
    )
  }
}
