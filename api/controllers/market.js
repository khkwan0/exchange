const order = async (req, reply) => {
  const type = req.body.type
  const amount = req.body.amount
  const price = req.body.price
  const market = req.body.market
  console.log(type, amount, price, market)
  reply.code(200).send()
}

export default {
  order,
}
