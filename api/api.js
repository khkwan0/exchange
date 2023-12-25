import Fastify from 'fastify'
import fastifyJWT from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import multipart from '@fastify/multipart'
import AsyncLock from 'async-lock'
import {DateTime} from 'luxon'
import fs from 'fs'
import fetch from 'node-fetch'
import routes from './routes/routes.js'
import {cacheGet} from './lib/redis.js'

const fastify = Fastify({ logger: true})
fastify.register(fastifyJWT, {secret: process.env.JWT_SECRET})
fastify.register(fastifyCookie)
fastify.register(multipart, {attachFieldsToBody: 'keyValues'})
fastify.register(routes, {prefix: '/api'})

fastify.addHook('onRequest', async (req, reply) => {
  try {
    if (req.raw.url === '/login' || req.raw.url === '/register') {
      return 
    } else {
      const res = await req.jwtVerify()
      const rawUser = await cacheGet(res.token)
      const user = JSON.parse(rawUser)
      if (typeof user?.userId !== 'undefined' && user.userId) {
        req.user = {
          userId: parseInt(user.userId),
        }
      }
    }
  } catch (e) {
    console.log(e)
    return
  }
})

const lock = new AsyncLock()

;(async () => {
  try {
    await fastify.listen({port: 3000, host: '0.0.0.0'})
  } catch (e) {
    fastify.log.error(e)
    process.exit(1)
  }
})()
