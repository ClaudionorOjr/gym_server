import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../middlewares/verify-jwt'
import { authenticate } from '../controllers/account/authenticate-controller'
import { registerAdmin } from '../controllers/account/register-admin-controller'
import { registerCustomer } from '../controllers/account/register-customer-controller'
import { editAdmin } from '../controllers/account/edit-admin-controller'
import { editCustomer } from '../controllers/account/edit-customer-controller'
import { deleteCustomer } from '../controllers/account/delete-customer-controller'
import { changePassword } from '../controllers/account/change-password-controller'
import { fetchCustomers } from '../controllers/account/fetch-customers-controller'
import { forgotPassword } from '../controllers/account/forgot-password-controller'
import { resetPassword } from '../controllers/account/reset-password-controller'

export async function accountRoutes(app: FastifyInstance) {
  /* POST */
  app.post('/sessions', authenticate)
  app.post('/admin/register', { onRequest: [verifyJWT] }, registerAdmin)
  app.post('/customer/register', { onRequest: [verifyJWT] }, registerCustomer)
  app.post('/forgot-password', forgotPassword)

  /* GET */
  app.get('/customers', { onRequest: [verifyJWT] }, fetchCustomers)

  /* PUT */
  app.put('/admin/:adminId', { onRequest: [verifyJWT] }, editAdmin)
  app.put('/customer/:customerId', { onRequest: [verifyJWT] }, editCustomer)
  app.put('/change-password', { onRequest: [verifyJWT] }, changePassword)
  app.put('/reset-password', resetPassword)

  /* DELETE */
  app.delete(
    '/customer/:customerId',
    { onRequest: [verifyJWT] },
    deleteCustomer,
  )
}
