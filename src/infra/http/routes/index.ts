import { FastifyInstance } from 'fastify'
import { accountRoutes } from './account.routes'
import { workoutRoutes } from './workout.routes'

export async function routes(app: FastifyInstance) {
  app.register(accountRoutes)
  app.register(workoutRoutes)
}
