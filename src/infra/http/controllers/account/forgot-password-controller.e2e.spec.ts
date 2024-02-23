import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import request from 'supertest'

describe('Forgot password (e2e)', () => {
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

  test('[POST] /forgot-password', async () => {
    const { accessToken } = await createAuthenticateUser(app, prisma, {
      email: 'claudionorojr@hotmail.com',
    })

    const response = await request(app.server)
      .post('/forgot-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'claudionorojr@hotmail.com',
      })

    console.log(response.body)

    expect(response.statusCode).toEqual(204)
  })
})
