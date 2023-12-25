import {doQuery, pool} from '../lib/index.js'

async function deductBalance(userId, currency, amount) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('LOCK TABLE balances IN ROW EXCLUSIVE MODE')

    // get balance
    const balanceQuery = 'SELECT * FROM balances WHERE user_id=$1 and currency=$2 FOR UPDATE'
    const balanceRes = await client.query(balanceQuery, [userId, currency])
    if (balanceRes.rowCount !== 1) {
      throw new Error('no balance row')
    }
    const balance = balanceRes?.rows?.[0]?.balance
    if (typeof balance === 'undefined') {
      throw new Error('row found, no balance')
    }

    // have enough?  if yes continue
    if (balance > amount) {

      // deduct balance
      const newBalance = balance - amount
      const balanceUpdateQuery = 'UPDATE balances SET balance=$1 WHERE user_id=$2 and currency=$3'
      const balanceUpdateRes = await client.query(balanceUpdateQuery, [newBalance, userId, currency])
      await client.query('COMMIT')
      return {deducted: amount, currency: currency, newBalance: newBalance}
    } else {
      await client.query('ROLLBACK')
      return {deducted: 0, currency: currency, newBalance: balance} 
    }
  } catch (e) {
    await client.query('ROLLBACK')
    throw new Error(e)
  } finally {
    client.release()
  }
}

async function creditBalance(userId, currency, amount) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('LOCK TABLE balances IN ROW EXCLUSIVE MODE')

    const balanceUpdateQuery = 'UPDATE balances SET balance=balance+$1 WHERE user_id=$2 and currency=$3'
    const balanceUpdateRes = await client.query(balanceUpdateQuery, [amount, userId, currency])
    await client.query('COMMIT')
    return {credited: amount, currency: currency, newBalance: amount}
  } catch (e) {
    await client.query('ROLLBACK')
    throw new Error(e)
  } finally {
    client.release()
  }
}

async function handleLimitOrder(order) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('LOCK TABLE balances IN ROW EXCLUSIVE MODE')

    // get balance
    const balanceQuery = 'SELECT * FROM balances WHERE user_id=$1 and currency=$2 FOR UPDATE'
    const balanceRes = await client.query(balanceQuery, [order.ownerId, order.base])
    if (balanceRes.rowCount !== 1) {
      throw new Error('no balance row')
    }
    const balance = balanceRes?.rows?.[0]?.balance
    if (typeof balance === 'undefined') {
      throw new Error('row found, no balance')
    }

    // have enough?  if yes continue
    if (balance > order.amount) {

      // deduct balance
      const newBalance = balance - order.amount
      const balanceUpdateQuery = 'UPDATE balances SET balance=$1 WHERE user_id=$2 and currency=$3'
      const balanceUpdateRes = await client.query(balanceUpdateQuery, [newBalances, order.ownerId, order.base])

      // insert order into book
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
    }
    return resQuery
  } catch (e) {
    await client.query('ROLLBACK')
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

export default {
  handleLimitOrder,
  handleMarketOrder,
  deductBalance,
}
