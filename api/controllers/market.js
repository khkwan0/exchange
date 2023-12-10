import {lPush} from '../models/index.js'
import {v4 as uuidv4} from 'uuid'

const order = async (req, reply) => {
  const action = req.body.action.toLowerCase() // buy or sell
  const type = req.body.type.toLowerCase() // market or limit
  const amount = req.body.amount
  const price = req.body.price
  const market = req.body.market.toLowerCase()

  try {
    if (
      (action === 'buy' || action === 'sell') &&
      (type === 'market' || type === 'limit')
    ) {
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
      reply.code(400).send({status: 'error', error: 'bad values'})
    }
  } catch (e) {
    console.log(e)
  }
}

export default {
  order
}
