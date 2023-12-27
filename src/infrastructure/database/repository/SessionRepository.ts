import { inject, injectable } from 'inversify'
import { PostgresPool } from '../PostgresPool.js'
import type { SaveSessionRequest } from '../../../core/repository/session/request/SaveSessionRequest.js'
import type { Session } from '../../../core/model/session/index.js'
import { sessionDataMapper } from '../mappers/session.js'
import type { SessionRepository } from '../../../core/repository/session/index.js'

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
    @inject(PostgresPool) private readonly postgresPool: PostgresPool
  ) {}

  public async save(entity: SaveSessionRequest): Promise<Session> {
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

    return sessionDataMapper(result.rows[0])
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

    return sessionDataMapper(result.rows[0])
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

    return sessionDataMapper(result.rows[0])
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
