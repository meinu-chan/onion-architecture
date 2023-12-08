import type { DataMapper } from '../../../core/common/mapper/DataMapper.js'
import { injectable } from 'inversify'
import type { LoadedSessionEntity } from '../repository/SessionRepository.js'
import { Session } from '../../../core/entity/Session/Session.js'

@injectable()
export class SessionDataMapper
  implements DataMapper<Session, LoadedSessionEntity>
{
  public toDomain(entity: LoadedSessionEntity): Session {
    return new Session(
      entity.user_id,
      entity.refresh_token,
      entity.created_at,
      entity.updated_at
    )
  }
}
