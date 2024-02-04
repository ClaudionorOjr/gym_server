import 'reflect-metadata'
import { PrismaService } from '@infra/database/prisma'
import { FastifyInstance } from 'fastify'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import { MusculatureFactory } from 'test/factories/make-musculature'
import request from 'supertest'
import { ExerciseFactory } from 'test/factories/make-exercise'

describe('Delete exercise (e2e)', () => {
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

  it('[DELETE] /exercises/:exerciseId', async () => {
    const musculature = await musculatureFactory.makePrismaMusculature()
    const exercise = await exerciseFactory.makePrismaExercise({
      musculatureId: musculature.id,
    })

    const { accessToken } = await createAuthenticateUser(app, prisma)

    const response = await request(app.server)
      .delete(`/exercises/${exercise.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(204)
  })
})
