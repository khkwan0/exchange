import {createClient} from 'redis'
import Fastify from 'fastify'
import * as dotenv from 'dotenv'
const fastify = Fastify({ logger: true})

dotenv.config()

const redisClient = createClient({url: process.env.REDIS_HOST})

;(async () => {
  await redisClient.connect()
  fastify.log.info("Redis HOST: " +  process.env.REDIS_HOST)
  fastify.log.info("Redis is: " + redisClient.isReady ? "Up": "Down")
})()

async function cacheGet(key) {
  try {
    const res = await redisClient.get(key)
    return res
  } catch (e) {
    console.log(e)
    return null
  }
}

async function cacheSet(key, value) {
  try {
    await redisClient.set(key, value)
  } catch(e) {
    console.log(e)
  }
}

async function cacheDel(key) {
  try {
    redisClient.del(key)
  } catch (e) {
    throw new Error(e)
  }
}
export {
  cacheDel,
  cacheGet,
  cacheSet,
}
