import { AppModule } from './AppModule.js'
import type { ContainerModule } from 'inversify'
import { SessionModule } from './user/session/SessionModule.js'
import { UserModule } from './user/UserModule.js'

export const modules: ContainerModule[] = [
  new AppModule(),
  new UserModule(),
  new SessionModule()
]
