import { AppModule } from './common/AppModule.js'
import { Container } from 'inversify'
import { UserModule } from './user/UserModule.js'

export class AppContainer extends Container {
  public constructor() {
    super({
      defaultScope: 'Singleton',
      skipBaseClassChecks: true
    })

    this.load(new AppModule())
    this.load(new UserModule())
  }
}
