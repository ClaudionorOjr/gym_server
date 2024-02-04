import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../middlewares/verify-jwt'

import { registerMeasurements } from '../controllers/workout/register-measurments-controller'
import { registerMusculature } from '../controllers/workout/register-musculature-controller'
import { registerExercise } from '../controllers/workout/register-exercise-controller'
import { prepareWorkout } from '../controllers/workout/prepare-workout-controller'

import { fetchMeasurements } from '../controllers/workout/fetch-measurements-controller'
import { fetchMusculatures } from '../controllers/workout/fetch-musculatures-controller'
import { fetchExercises } from '../controllers/workout/fetch-exercises-controller'
import { getExercise } from '../controllers/workout/get-exercise-controller'

import { editExercise } from '../controllers/workout/edit-exercise-controller'

import { deleteMeasurements } from '../controllers/workout/delete-measurements-controller'
import { deleteMusculature } from '../controllers/workout/delete-musculature-controller'
import { deleteExercise } from '../controllers/workout/delete-exercise-controller'
import { getMusculature } from '../controllers/workout/get-musculature-controller'
import { deleteWorkout } from '../controllers/workout/delete-workout-controller'
import { editWorkout } from '../controllers/workout/edit-workout-controller'
import { fetchWorkoutsCustomer } from '../controllers/workout/fetch-workouts-customer-controller'
import { getWorkout } from '../controllers/workout/get-workout-controller'
import { getMeasurements } from '../controllers/workout/get-measurements-controller'

export async function workoutRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  /* POST */
  app.post('/customers/:customerId/measurements', registerMeasurements)
  app.post('/musculatures/register', registerMusculature)
  app.post('/exercises/register', registerExercise)
  app.post('/customers/:customerId/workout', prepareWorkout)

  /* GET */
  app.get('/musculatures/:musculatureId', getMusculature)
  app.get('/exercises/:exerciseId', getExercise)
  app.get('/customers/measurements/:measurementsId', getMeasurements)
  app.get('/customers/workouts/:workoutId', getWorkout)
  app.get('/musculatures', fetchMusculatures)
  app.get('/exercises', fetchExercises)
  app.get('/customers/:customerId/measurements', fetchMeasurements)
  app.get('/customers/:customerId/workouts', fetchWorkoutsCustomer)

  /* PUT */
  app.put('/exercises/:exerciseId', editExercise)
  app.put('/customers/workouts/:workoutId', editWorkout)

  /* DELETE */
  app.delete('/customers/measurments/:measurementsId', deleteMeasurements)
  app.delete('/musculatures/:musculatureId', deleteMusculature)
  app.delete('/exercises/:exerciseId', deleteExercise)
  app.delete('/customers/workouts/:workoutId', deleteWorkout)
}
