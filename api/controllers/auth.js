import bcrypt from 'bcrypt'
import {createAndSaveSecretKey} from '../lib/utils/index.js'
import {user as dbUser} from '../models/index.js'

// after auth, store user id into redis.
// the key for the redis store is a random token
// only send the token back in a jwt to the client
// the jwt will be used to get playerId in
// authenticated requests
const login = async (req, reply) => {
  if (
    typeof req.body.email !== 'undefined' &&
    req.body.email &&
    typeof req.body.password !== 'undefined' &&
    req.body.password
  ) {
    const fastify = req.server
    const {email, password} = req.body
    fastify.log.info("Login attempt: " + email)
    const res = await HandleLogin(email.toLowerCase(), password)
    if (res.status === 'ok') {
      const token = await createAndSaveSecretKey(res.user)
      const jwt = fastify.jwt.sign({token: token})
      reply.code(200).send({ status: 'ok',
        data: {
          token: jwt,
          user: res,
        },
      })
    } else {
      reply.code(401).send({})
    }
  } else {
    reply.code(400).send({status: 'error', error: 'invalid input'})
  }
}

const register = async (req, reply) => {
  if (
    typeof req.body.email !== 'undefined' &&
    req.body.email &&
    typeof req.body.password !== 'undefined' &&
    req.body.password &&
    req.body.password.length >= 7 &&
    typeof req.body.password2 !== 'undefined' &&
    req.body.password === req.body.password2
  ) {
    const res = await HandleRegister(req.body.email, req.body.password)
    if (res.status === 'ok') {
      reply.code(200).send({status: 'ok'})
    } else {
      reply.code(500).send({status: 'error', error: res.error})
    }
  } else {
    reply.code(400).send()
  }
}

async function HandleLogin(email = '', password = '') {
  try {
    const resUser = await dbUser.getUserByEmail(email)
    if (resUser.length === 1) {
      const user = resUser[0]
      const passwordHash = user.password

      // for old bcrypt algorithms backward compatibility
      const newHash = passwordHash.match(/^\$2y/) ? passwordHash.replace("$2y", "$2a") : passwordHash

      const pass = await bcrypt.compare(password, newHash)
      if (pass) {
        return {status: 'ok', user: user}
      } else {
        return {status: 'error', error: 'wrong creds'}
      }
    } else {
      return {status: 'error', error: 'too many users with same email'}
    }
  } catch (e) {
    console.log(e)
    return {status: 'error', error: e.message}
  }
}

async function HandleRegister(email = '', password = '') {
  try {
    const SALT_ROUNDS = 10
    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    const res = await dbUser.register(email, hash)
    if (res.rowCount === 1) {
      return {status: 'ok'}
    } else {
      return {status: 'error', error: 'could not insert user'}
    }
  } catch (e) {
    return {status: 'error', error: e.message}
  }
}

export default {
  login,
  register,
}
