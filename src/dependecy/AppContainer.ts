import { Container } from 'inversify'
import { modules } from './_list.js'

export class AppContainer extends Container {
  public constructor() {
    super({
      defaultScope: 'Singleton',
      skipBaseClassChecks: true
    })

    this.load(...modules.map((Module) => new Module()))
  }
}
