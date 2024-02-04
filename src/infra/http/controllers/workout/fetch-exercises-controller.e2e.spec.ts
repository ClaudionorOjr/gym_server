import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { ExerciseFactory } from 'test/factories/make-exercise'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import { MusculatureFactory } from 'test/factories/make-musculature'
import request from 'supertest'

describe('Fetch exercises (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let musculatureFactory: MusculatureFactory
  let exerciseFactory: ExerciseFactory

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    musculatureFactory = new MusculatureFactory(prisma)
    exerciseFactory = new ExerciseFactory(prisma)

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('[GET] /exercises', async () => {
    const musculature = await musculatureFactory.makePrismaMusculature({
      name: 'bust',
    })

    await Promise.all([
      exerciseFactory.makePrismaExercise({
        name: 'Bench press',
        musculatureId: musculature.id,
      }),
      exerciseFactory.makePrismaExercise({
        name: 'Leg press',
        musculatureId: musculature.id,
      }),
    ])

    const { accessToken } = await createAuthenticateUser(app, prisma)

    const response = await request(app.server)
      .get('/exercises')
      .set({
        Authorization: `Bearer ${accessToken}`,
      })
      .send()

    expect(response.statusCode).toEqual(200)
  })
})
