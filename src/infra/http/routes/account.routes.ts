import { FastifyInstance } from 'fastify'
import { registerAdmin } from '../controllers/account/register-admin-controller'
import { registerCustomer } from '../controllers/account/register-customer-controller'
import { verifyJWT } from '../middlewares/verify-jwt'

export async function accountRoutes(app: FastifyInstance) {
  /* TOKEN */
  app.addHook('onRequest', verifyJWT)

  /* POST */
  app.post('/admin/register', registerAdmin)
  app.post('/customer/register', registerCustomer)
}
