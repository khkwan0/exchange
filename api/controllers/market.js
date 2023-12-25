import {lPush} from '../lib/index.js'
import {v4 as uuidv4} from 'uuid'
import orderModel from '../models/orders.js'

async function HandleBuyBalance(req) {
  try {
    const amount = req.body.amount
    const market = req.body.market.toLowerCase()
    const currency = market.split('-')[1]
    const userId = req.user.userId
    const deductBalanceRes = await orderModel.deductBalance(userId, currency, amount)
    return deductBalanceRes
  } catch (e) {
    throw new Error(e)
  }
}

async function HandleSellBalance(req) {
  try {
    const amount = req.body.amount
    const market = req.body.market.toLowerCase()
    const currency = market.split('-')[0]
    const userId = req.user.userId
    const deductBalanceRes = await orderModel.deductBalance(userId, currency, amount)
    return deduceBalanceRes
  } catch (e) {
    throw new Error(e)
  }
}

async function order(req, reply) {
  const action = req.body.action.toLowerCase() // buy or sell
  const type = req.body.type.toLowerCase() // market or limit
  const amount = req.body.amount
  const market = req.body.market.toLowerCase()
  const price = req.body.price
  const currency = market.split('-')[0]

  try {
    if (
      (action === 'buy' || action === 'sell') &&
      (type === 'market' || type === 'limit')
    ) {
      let allow = false
      if (action === 'buy') {
        const res = await HandleBuyBalance(req)
        if (res.deducted > 0) {
          allow = true
        }
      } else {
        const res = await HandleSellBalance(req)
        if (res.deducted > 0) {
          allow = true
        }
      }

      if (allow) {
        const uuid = uuidv4()
        const _order = {
          action,
          type,
          amount,
          price,
          market, // ex: btc-usdc
          uuid: uuid,
          ownerId: req.user.userId,
          timestamp: Date.now(),
        }

        // todo. check validity of the market
        const res = await lPush(market, JSON.stringify(_order))
        if (res.status === 'ok') {
          reply.code(200).send({status: 'ok', data: _order})
        } else {
          reply.code(500).send({status: 'error', error: 'could not push into queue'})
        }
      } else {
        reply.code(401).send({status: 'error', error: 'balance shortage'})
      }
    } else {
      reply.code(400).send({status: 'error', error: 'bad values'})
    }
  } catch (e) {
    console.log(e)
    reply.code(500).send({status: 'error', error: e.message})
  }
}

export default {
  order
}
