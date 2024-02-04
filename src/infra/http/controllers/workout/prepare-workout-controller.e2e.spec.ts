import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { CustomerFactory } from 'test/factories/make-customer'
import { ExerciseFactory } from 'test/factories/make-exercise'
import { MusculatureFactory } from 'test/factories/make-musculature'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import request from 'supertest'

describe('Prepare workout (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let musculatureFactory: MusculatureFactory
  let customerFactory: CustomerFactory
  let exerciseFactory: ExerciseFactory

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    musculatureFactory = new MusculatureFactory(prisma)
    customerFactory = new CustomerFactory(prisma)
    exerciseFactory = new ExerciseFactory(prisma)

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('[POST] /customers/:customerId/workout', async () => {
    const customer = await customerFactory.makePrismaCustomer()

    const musculature = await musculatureFactory.makePrismaMusculature()
    const exercise = await exerciseFactory.makePrismaExercise({
      musculatureId: musculature.id,
    })

    const { accessToken } = await createAuthenticateUser(app, prisma)

    const response = await request(app.server)
      .post(`/customers/${customer.id}/workout`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        exerciseId: exercise.id,
        series: 3,
        repetitions: 12,
        weight: 10,
        note: 'Nothing',
      })

    expect(response.statusCode).toEqual(201)

    const workoutOnDatabase = await prisma.workout.findFirstOrThrow({
      where: {
        customerId: customer.id,
      },
    })

    expect(workoutOnDatabase).toBeTruthy()
  })
})
