import { config } from '../../../config.js'
import { getAccessToken, getRefreshToken, getUser, saveRefreshToken } from './util/access.js'
import { httpErrorHandler } from './error.js'
import { receiveBody, receiveQuery } from './util/receive.js'
import type { RouteHandler } from '../../RouteHandler.js'
import type { Transport } from '../index.js'
import { createServer, Server, ServerResponse } from 'node:http'

const HEADERS = {
  'Content-Type': 'application/json; charset=UTF-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
}

const NOT_FOUND = JSON.stringify({ status: 'Not Found' })

const endResponse = (res: ServerResponse, status: number, payload: unknown) => {
  res.writeHead(status, HEADERS)
  res.end(JSON.stringify(payload))
}

export const httpTransport: Transport<Server> = (routing, port, container) => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const server = createServer(async (req, res) => {
    if (req.method !== 'POST' || !req.url) {
      return endResponse(res, 404, NOT_FOUND)
    }
    const { url, socket } = req
    console.log(`${socket.remoteAddress}\t ${req.method} ${url}`)
    const [place, name, method] = url.substring(1).split('/')
    if (place !== 'api') return endResponse(res, 404, NOT_FOUND)
    const entity = routing[name]
    if (!entity) return void res.end(NOT_FOUND)
    const handlerIdentifier = entity[method]
    if (!handlerIdentifier) return void res.end(NOT_FOUND)
    const query = receiveQuery(url)
    const body = await receiveBody(req)
    const handler = container.get<RouteHandler>(handlerIdentifier)
    const response = await handler.proceedRequest(
      { ...body, ...query },
      {
        saveRefreshToken: saveRefreshToken(req, res, container),
        getAccessToken: getAccessToken(req, res, container),
        getRefreshToken: getRefreshToken(req, res, container),
        getUser: getUser(req, res, container)
      }
    )
    if ('error_type' in response) {
      const errorResponse = httpErrorHandler(response)
      return endResponse(res, errorResponse.code, {
        status: errorResponse.status,
        error: errorResponse.error
      })
    }
    return endResponse(res, 200, response)
  })

  server.listen(port, config.app.host, () => {
    console.info(`HTTP/1.1 Server started http://${config.app.host}:${port}.`)
  })

  return server
}
