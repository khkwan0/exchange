import Fastify from 'fastify'
import {doQuery} from '../models/db.js'
import {brPop} from '../models/redis.js'

const fastify = Fastify({ logger: true})

const markets = [
  'btc-usdc'
]

;(async () => {
  while(1) {
    try {
      for (let i = 0; i < markets.length; i++) {
        const res = await brPop(markets[i], 1)
        if (
          res &&
          typeof res.key !== 'undefined' &&
          markets.includes(res.key) &&
          typeof res.element !== 'undefined'
        ) {
          const order = JSON.parse(res.element)
          if (order.type === 'limit') {
            // pull from fifo queue and store into book
            const query = 'insert into order_book(market, amount, price, action, order_id, active, owner_id) values($1, $2, $3, $4, $5, $6, $7)'
            const toSave = [
              order.market,
              order.amount,
              order.price,
              order.action,
              order.uuid,
              true,
              order.ownerId,
            ]
            const resQuery = await doQuery(query, toSave)
          }
        }
      }
    } catch (e) {
      fastify.log.error(e.message)
    }
  }
})()

;(async () => {
  try {
    await fastify.listen({port: 3000, host: '0.0.0.0'})
  } catch (e) {
    fastify.log.error(e)
    process.exit(1)
  }
})()

