import 'reflect-metadata'
import { PrismaService } from '@infra/database/prisma'
import { FastifyInstance } from 'fastify'
import { MusculatureFactory } from 'test/factories/make-musculature'
import request from 'supertest'
import { createAuthenticateUser } from 'test/create-authenticate-user'

describe('Register exercise (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let musculatureFactory: MusculatureFactory

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    musculatureFactory = new MusculatureFactory(prisma)

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('[POST] /exercises/register', async () => {
    const musculature = await musculatureFactory.makePrismaMusculature()

    const { accessToken } = await createAuthenticateUser(app, prisma)

    const response = await request(app.server)
      .post('/exercises/register')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        musculatureId: musculature.id,
        name: 'Bench press',
        equipment: 'Incline bench press',
      })

    expect(response.statusCode).toEqual(201)

    const exerciseOnDatabase = await prisma.exercise.findUnique({
      where: {
        name: 'Bench press',
      },
    })

    expect(exerciseOnDatabase).toBeTruthy()
  })
})
