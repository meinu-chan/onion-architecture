#!/usr/bin/env node
import { getIntegerFromEnv } from '../infrastructure/config/getFromEnv.js'
import { getServer } from '../server.js'
import 'reflect-metadata'

const server = getServer()

server
  .listen({
    host: process.env.HTTP_HOST ?? 'localhost',
    port: getIntegerFromEnv('HTTP_PORT', 8080)
  })
  .catch((err: unknown) => {
    server.log.error(err)
    process.exit(1)
  })
