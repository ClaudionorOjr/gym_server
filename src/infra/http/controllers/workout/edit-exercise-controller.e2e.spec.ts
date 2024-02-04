import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { ExerciseFactory } from 'test/factories/make-exercise'
import { MusculatureFactory } from 'test/factories/make-musculature'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import request from 'supertest'

describe('Edit exercise (e2e)', () => {
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

  it('[PUT] /exercises/:exerciseId', async () => {
    const musculature01 = await musculatureFactory.makePrismaMusculature({
      name: 'bust',
    })
    const exercise = await exerciseFactory.makePrismaExercise({
      musculatureId: musculature01.id,
    })

    const musculature02 = await musculatureFactory.makePrismaMusculature()

    const { accessToken } = await createAuthenticateUser(app, prisma)

    const response = await request(app.server)
      .put(`/exercises/${exercise.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'leg press',
        musculatureId: musculature02.id,
        equipment: 'leg press machine',
      })

    expect(response.statusCode).toEqual(204)

    const updatedExercise = await prisma.exercise.findUniqueOrThrow({
      where: {
        id: exercise.id,
      },
    })

    expect(updatedExercise).toMatchObject({
      id: expect.any(String),
      name: 'leg press',
      musculatureId: musculature02.id,
      equipment: 'leg press machine',
    })
  })
})
