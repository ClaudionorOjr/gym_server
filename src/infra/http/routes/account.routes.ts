import { FastifyInstance } from 'fastify'
import { registerAdmin } from '../controllers/account/register-admin-controller'

export async function accountRoutes(app: FastifyInstance) {
  /* POST */
  app.post('/admin/register', registerAdmin)
}
