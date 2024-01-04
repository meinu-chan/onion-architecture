import { AppContainer } from './dependency/AppContainer.js'
import { config } from './config.js'
import { getIntegerFromEnv } from './lib/util/getIntegerFromEnv.js'
import { initApiRouting } from './api/initRouting.js'
import { transporters, type Transport } from './api/transport/index.js'

function getTransporter(): Transport {
  const transportName = config.app.transport.toLocaleLowerCase()
  const transport = transporters[transportName]
  if (!transport) throw new Error(`Transport '${transportName}' doesn't exist.`)
  return transport
}

export async function startServer(): Promise<void> {
  const transport = getTransporter()
  const container = new AppContainer()
  const routing = await initApiRouting(container)
  await transport(routing, getIntegerFromEnv('HTTP_PORT') ?? 8000, container)
}
