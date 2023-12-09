import Fastify from 'fastify'
import fastifyJWT from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import multipart from '@fastify/multipart'
import AsyncLock from 'async-lock'
import {DateTime} from 'luxon'
import fs from 'fs'
import fetch from 'node-fetch'
import routes from './routes/routes.js'

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
      await req.jwtVerify()
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

// after auth, store user id into redis.
// the key for the redis store is a random token
// only send the token back in a jwt to the client
// the jwt will be used to get playerId in
// authenticated requests
/*
fastify.post('/login', async (req, reply) => {
  if (typeof req.body.email && typeof req.body.password) {
    const {email, password} = req.body
    fastify.log.info("Login attempt: " + email)
    const res = await HandleLogin(email.toLowerCase(), password)
    if (res) {
      const token = await CreateAndSaveSecretKey(res)
      const jwt = fastify.jwt.sign({token: token})
      return {
        status: 'ok',
        data: {
          token: jwt,
          user: res,
        }
      }
    } else {
      reply.code(401).send()
    }
  } else {
    reply.code(401).send()
  }
})
*/
/*

fastify.get('/logout', async (req, reply) => {
  try {
    await req.jwtVerify()
    await CacheDel(req.user.token)
  } catch (e) {
    fastify.log.error("Invalid JWT")
    reply.code(200).send()
  }
})

fastify.get('/user', async (req, reply) => {
  try {
    await req.jwtVerify()
    const userid = await GetPlayerIdFromToken(req.user.token)
    if (userid) {
      const userData = await GetPlayer(userid)
      return userData
    } else {
      fastify.log.error("No user id found from jwt")
      reply.code(404).send()
    }
  } catch (e) {
    fastify.log.error("Invalid JWT")
    reply.code(404).send()
  }
})

fastify.post('/user', async (req, reply) => {
  try {
    if (
      typeof req.body.email !== 'undefined' &&
      typeof req.body.password !== 'undefined' &&
      typeof req.body.password_confirm !== 'undefined' &&
      req.body.password &&
      req.body.password.length >= 8 &&
      req.body.password === req.body.password_confirm
    ) {
      const res = await RegisterNewUser(req.body.email, req.body.password)
      if (res.status === 'ok') {
      } else {
        reply.code(401).send({error: res.error})
      }
    } else {
      reply.code(401).send()
    }
  } catch (e) {
    fastify.log.error(e)
    reply.code(404).send()
  }
})


fastify.ready().then(() => {
})
*/

/* ---------  FINISH FASIFY ------------*/
/*

function GenerateToken() {
  return new Promise((resolve, reject) => {
    crypto.randomByes(48, (err, buffer) => {
      if (err) {
        reject(err)
      } else {
        resolve(buffer.toString('hex'))
      }
    })
  })
}

async function HandleLogin(email = '', password = '') {
  try {
    const user = await GetUserByEmail(email)
    const passwordHash = user.password

    // for old bcrypt algorithms backward compatibility
    const newHash = passwordHash.match(/^\$2y/) ? passwordHash.replace("$2y", "$2a") : passwordHash

    const pass = await bcrypt.compare(password, newHash)
    if (pass) {
      const player = await GetPlayer(user.player_id)
      return player
    } else {
      return null
    }
  } catch (e) {
    console.log(e)
    return null
  }
}

async function RegisterNewUser(email = '', password = '') {
  try {
    const res = DoQuery('select id from users where email=$1', [email])
    if (res.rows.length > 0) {
      return {
        status: 'error',
        error: 'email exists'
      }
    } else {
      const SALT_ROUNDS = 10
      const hash = await bcrypt.hash(password, SALT_ROUNDS)
      const insertRes = DoQuery('insert into users(email, password) values($1, $2)', [email, hash])
      console.log(insertRes)
      return {status: 'ok'}
    }
  } catch (e) {
    console.log(e)
    return {status: 'error', error: ''}
  }
}
*/
