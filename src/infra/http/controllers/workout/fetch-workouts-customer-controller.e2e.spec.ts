import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { WorkoutFactory } from 'test/factories/make-workout'
import { CustomerFactory } from 'test/factories/make-customer'
import { ExerciseFactory } from 'test/factories/make-exercise'
import { MusculatureFactory } from 'test/factories/make-musculature'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import request from 'supertest'

describe('Fetch customer workouts (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let customerFactory: CustomerFactory
  let workoutFactory: WorkoutFactory
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

  it('[GET] /customers/:customerId/workouts', async () => {
    const customer = await customerFactory.makePrismaCustomer()
    const musculature = await musculatureFactory.makePrismaMusculature()

    const exercise01 = await exerciseFactory.makePrismaExercise({
      musculatureId: musculature.id,
    })
    const exercise02 = await exerciseFactory.makePrismaExercise({
      name: 'leg press',
      musculatureId: musculature.id,
      equipment: 'leg press machine',
    })

    await Promise.all([
      workoutFactory.makePrismaWorkout({
        customerId: customer.id,
        exerciseId: exercise01.id,
      }),
      workoutFactory.makePrismaWorkout({
        customerId: customer.id,
        exerciseId: exercise02.id,
      }),
    ])

    const { accessToken } = await createAuthenticateUser(app, prisma)

    const result = await request(app.server)
      .get(`/customers/${customer.id}/workouts`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(result.statusCode).toEqual(200)
    expect(result.body.workouts).toHaveLength(2)
  })
})
