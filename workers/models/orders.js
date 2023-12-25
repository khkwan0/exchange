import {doQuery, pool} from '../lib/index.js'

async function handleLimitOrder(order) {
  const client = await pool.connect()
  try {
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
    const resQuery = await client.query(query, toSave)
    return resQuery
  } catch (e) {
    throw new Error(e)
  } finally {
    client.release()
  }
}

async function handleMarketOrder(order) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
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
    const resQuery = await client.query(query, toSave)
    await client.query('COMMIT')
    return resQuery
  } catch (e) {
    await client.query('ROLLBACK')
    throw new Error(e)
  } finally {
    client.release()
  }
}

export {
  handleLimitOrder,
  handleMarketOrder,
}
