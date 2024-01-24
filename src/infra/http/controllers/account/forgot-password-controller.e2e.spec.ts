import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { AdminFactory } from 'test/factories/make-admin'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import request from 'supertest'

describe('Forgot password (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let jwtEncrypter: JwtEncrypter

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    adminFactory = new AdminFactory(prisma)
    jwtEncrypter = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /forgot-password', async () => {
    const admin = await adminFactory.makePrismaAdmin({
      email: 'claudionorojr@hotmail.com',
    })

    const accessToken = await jwtEncrypter.encrypt({ sub: admin.id })

    const response = await request(app.server)
      .post('/forgot-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: admin.email,
      })

    console.log(response.body)

    expect(response.statusCode).toEqual(204)
  })
})
