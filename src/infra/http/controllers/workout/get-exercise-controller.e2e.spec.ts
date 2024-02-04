import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { ExerciseFactory } from 'test/factories/make-exercise'
import { MusculatureFactory } from 'test/factories/make-musculature'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import request from 'supertest'

describe('Get exercise (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let exerciseFactory: ExerciseFactory
  let musculatureFactory: MusculatureFactory

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    exerciseFactory = new ExerciseFactory(prisma)
    musculatureFactory = new MusculatureFactory(prisma)

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('[GET] /exercises/:exerciseId', async () => {
    const musculature = await musculatureFactory.makePrismaMusculature()
    const exercise = await exerciseFactory.makePrismaExercise({
      musculatureId: musculature.id,
    })

    const { accessToken } = await createAuthenticateUser(app, prisma)

    const response = await request(app.server)
      .get(`/exercises/${exercise.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({ exercise })
  })
})
