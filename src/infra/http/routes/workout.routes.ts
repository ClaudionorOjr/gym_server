import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../middlewares/verify-jwt'
import { registerMeasurements } from '../controllers/workout/register-measurments-controller'
import { fetchMeasurements } from '../controllers/workout/fetch-measurements-controller'
import { deleteMeasurements } from '../controllers/workout/delete-measurements-controller'

export async function workoutRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  /* POST */
  app.post('/customers/:customerId/measurements', registerMeasurements)

  /* GET */
  app.get('/customers/:customerId/measurements', fetchMeasurements)

  /* DELETE */
  app.delete('/customers/:measurementsId', deleteMeasurements)
}
