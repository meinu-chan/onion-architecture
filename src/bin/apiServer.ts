#!/usr/bin/env node

import 'reflect-metadata'
import { getIntegerFromEnv } from '../config/getFromEnv.js'
import { getServer } from '../server.js'

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
