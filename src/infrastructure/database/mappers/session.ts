import type { LoadedSessionEntity } from '../repository/SessionRepository.js'
import type { Session } from '../../../core/model/session/index.js'
import { wrapDataMapper } from './index.js'

export const sessionDataMapper = wrapDataMapper<LoadedSessionEntity, Session>(
  (from: LoadedSessionEntity) => ({
    refreshToken: from.refresh_token,
    userId: from.user_id,
    updatedAt: from.updated_at,
    createdAt: from.created_at
  })
)
