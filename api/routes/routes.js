import {auth, market} from '../controllers/index.js'

function routes (fastify, opts, done) {
  fastify.post('/login', auth.login)
  fastify.post('/register', auth.register)
  fastify.post('/order', market.order)
  done()
}

export default routes
