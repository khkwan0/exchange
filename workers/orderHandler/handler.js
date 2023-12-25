import Fastify from 'fastify'
import {handleLimitOrder, handleMarketOrder} from '../models/index.js'
import {brPop} from '../lib/redis.js'

const fastify = Fastify({ logger: true})

const markets = [
  'btc-usdc'
]

async function HandlerStart() {
  while(1) {
    try {
      for (let i = 0; i < markets.length; i++) {
        // pull from fifo queue and store into book
        const res = await brPop(markets[i], 1) // pops off the queue
        if (
          res &&
          typeof res.key !== 'undefined' &&
          markets.includes(res.key) &&
          typeof res.element !== 'undefined'
        ) {
          const order = JSON.parse(res.element)
          if (order.type === 'limit') {
            const orderRes = await handleLimitOrder(order)
          } else if (order.type === 'market') {
            await handleMarketOrder(order)
          }
        }
      }
    } catch (e) {
      fastify.log.error(e.message)
    }
  }
}

;(async () => {
  try {
    await fastify.listen({port: 3000, host: '0.0.0.0'})
    HandlerStart()
  } catch (e) {
    fastify.log.error(e)
    process.exit(1)
  }
})()

