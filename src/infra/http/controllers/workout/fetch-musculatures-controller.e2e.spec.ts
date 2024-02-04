import 'reflect-metadata'
import { PrismaService } from '@infra/database/prisma'
import { FastifyInstance } from 'fastify'
import { MusculatureFactory } from 'test/factories/make-musculature'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import request from 'supertest'

describe('Fetch musculatures (e2e)', () => {
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

  it('[GET] /musculatures', async () => {
    await Promise.all([
      musculatureFactory.makePrismaMusculature({ name: 'bust' }),
      musculatureFactory.makePrismaMusculature({ name: 'thigh' }),
    ])

    const { accessToken } = await createAuthenticateUser(app, prisma)

    const response = await request(app.server)
      .get('/musculatures')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.musculatures).toHaveLength(2)
  })
})
