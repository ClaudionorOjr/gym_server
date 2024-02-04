import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { CustomerFactory } from 'test/factories/make-customer'
import { ExerciseFactory } from 'test/factories/make-exercise'
import { MusculatureFactory } from 'test/factories/make-musculature'
import { WorkoutFactory } from 'test/factories/make-workout'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import { Prisma } from '@prisma/client'
import request from 'supertest'

describe('Edit workout (e2e)', () => {
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

  it('[PUT] /customers/workouts/:workoutId', async () => {
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
      .put(`/customers/workouts/${workout.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        series: 12,
        repetitions: 3,
        weight: 12,
        note: 'Description test',
      })

    expect(response.statusCode).toEqual(204)

    const updatedWorkout = await prisma.workout.findUniqueOrThrow({
      where: {
        id: workout.id,
      },
    })

    expect(updatedWorkout).toMatchObject({
      id: expect.any(String),
      customerId: expect.any(String),
      exerciseId: expect.any(String),
      series: expect.any(Prisma.Decimal),
      repetitions: expect.any(Prisma.Decimal),
      weight: expect.any(Prisma.Decimal),
      note: 'Description test',
    })
  })
})
