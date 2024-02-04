import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import request from 'supertest'

describe('Register musculature (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('[POST] /musculatures/register', async () => {
    const { accessToken } = await createAuthenticateUser(app, prisma)

    const response = await request(app.server)
      .post('/musculatures/register')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        name: 'Triceps',
      })

    expect(response.statusCode).toEqual(201)

    const musculatureOnDatabase = await prisma.musculature.findUniqueOrThrow({
      where: {
        name: 'Triceps',
      },
    })

    expect(musculatureOnDatabase).toBeTruthy()
  })
})
