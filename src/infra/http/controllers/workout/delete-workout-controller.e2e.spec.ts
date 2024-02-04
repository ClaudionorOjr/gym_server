import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { WorkoutFactory } from 'test/factories/make-workout'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import { CustomerFactory } from 'test/factories/make-customer'
import { ExerciseFactory } from 'test/factories/make-exercise'
import { MusculatureFactory } from 'test/factories/make-musculature'
import request from 'supertest'

describe('Delete workout (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let workoutFactory: WorkoutFactory
  let customerFactory: CustomerFactory
  let musculatureFactory: MusculatureFactory
  let exerciseFactory: ExerciseFactory

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    customerFactory = new CustomerFactory(prisma)
    musculatureFactory = new MusculatureFactory(prisma)
    exerciseFactory = new ExerciseFactory(prisma)
    workoutFactory = new WorkoutFactory(prisma)

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('[DELETE] /customers/workouts/:workoutId', async () => {
    const customer = await customerFactory.makePrismaCustomer()
    const musculature = await musculatureFactory.makePrismaMusculature()
    const exercise = await exerciseFactory.makePrismaExercise({
      musculatureId: musculature.id,
    })
    const workout = await workoutFactory.makePrismaWorkout({
      customerId: customer.id,
      exerciseId: exercise.id,
    })

    const { accessToken } = await createAuthenticateUser(app, prisma)

    const response = await request(app.server)
      .delete(`/customers/workouts/${workout.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(204)
  })
})
