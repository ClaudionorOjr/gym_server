import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { MusculatureFactory } from 'test/factories/make-musculature'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import request from 'supertest'

describe('Delete musculature (e2e)', () => {
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

  it('[DELETE] /musculatures/:musculatureId', async () => {
    const musculature = await musculatureFactory.makePrismaMusculature()

    const { accessToken } = await createAuthenticateUser(app, prisma)

    const response = await request(app.server)
      .delete(`/musculatures/${musculature.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(204)
  })
})
