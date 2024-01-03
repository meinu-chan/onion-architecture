import { AppContainer } from './dependency/AppContainer.js'
import { config } from './config.js'
import { getIntegerFromEnv } from './util/getIntegerFromEnv.js'
import { initApiRouting } from './presentation/api/initRouting.js'
import { Transport, transporters } from './presentation/transport/index.js'

function getTransporter(): Transport {
  const transportName = config.app.transport.toLocaleLowerCase()
  const transport = transporters[transportName]
  if (!transport) throw new Error(`Transport '${transportName}' doesn't exist.`)
  return transport
}

export async function startServer(): Promise<void> {
  const transport = getTransporter()
  const container = new AppContainer()
  const routing = initApiRouting(container)
  await transport(routing, getIntegerFromEnv('HTTP_PORT') ?? 8000, container)
}
