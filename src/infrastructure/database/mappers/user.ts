import type { LoadedUserEntity } from '../repository/UserRepository.js'
import type { User } from '../../../core/model/user/index.js'
import { wrapDataMapper } from './index.js'

export const userDataMapper = wrapDataMapper<LoadedUserEntity, User>(
  (from) => ({
    id: from.id,
    email: from.email,
    name: from.name,
    password: from.password,
    createdAt: from.created_at
  })
)
