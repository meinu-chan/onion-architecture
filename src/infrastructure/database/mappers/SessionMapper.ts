import type { DataMapper } from '../../../core/common/mapper/DataMapper.js'
import { injectable } from 'inversify'
import type { LoadedSessionEntity } from '../repository/SessionRepository.js'
import type { Session } from '../../../core/entity/Session/Session.js'

@injectable()
export class SessionDataMapper
  implements DataMapper<Session, LoadedSessionEntity>
{
  public toDomain(entity: LoadedSessionEntity): Session {
    return {
      refreshToken: entity.refresh_token,
      userId: entity.user_id,
      updatedAt: entity.updated_at,
      createdAt: entity.created_at
    }
  }
}
