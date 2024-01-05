import { config } from '../../../config.js'
import type { RouteHandler } from '../../RouteHandler.js'
import type { Transport } from '../index.js'
import querystring from 'node:querystring'
import { type IncomingMessage, createServer, Server } from 'node:http'

const HEADERS = {
  'Content-Type': 'application/json; charset=UTF-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}

const NOT_FOUND = JSON.stringify({ status: 'Not Found' })

export const httpTransport: Transport<Server> = (routing, port, container) => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const server = createServer(async (req, res) => {
    void res.writeHead(200, HEADERS)
    if (req.method !== 'POST' || !req.url) return void res.end(NOT_FOUND)
    const { url, socket } = req
    console.log(`${socket.remoteAddress}\t ${req.method} ${url}`)
    const [place, name, method] = url.substring(1).split('/')
    if (place !== 'api') return void res.end(NOT_FOUND)
    const entity = routing[name]
    if (!entity) return void res.end(NOT_FOUND)
    const handlerName = entity[method]
    if (!handlerName) return void res.end(NOT_FOUND)
    const query = receiveQuery(url)
    const body = await receiveBody(req)
    const handler = container.get<RouteHandler>(handlerName)
    const response = await handler.proceedRequest({ ...body, ...query })
    void res.end(JSON.stringify(response))
  })

  server.listen(port, config.app.host, () => {
    console.info(`HTTP/1.1 Server started http://${config.app.host}:${port}.`)
  })

  return server
}

async function receiveBody(req: IncomingMessage): Promise<any> {
  const buffers = []
  for await (const chunk of req) buffers.push(chunk)
  const data = Buffer.concat(buffers).toString()

  return JSON.parse(data)
}

function receiveQuery(pathname: string): any {
  const queryIndex = pathname.indexOf('?')
  if (queryIndex < 0) return undefined
  const query = pathname.slice(queryIndex + 1)
  return querystring.parse(query)
}
