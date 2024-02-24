import 'reflect-metadata'
import { PrismaService } from '@infra/database/prisma'
import { FastifyInstance } from 'fastify'
import { AdminFactory } from 'test/factories/make-admin'
import supertest from 'supertest'
import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'

describe('Refresh token (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let bcrypterHasher: BcryptHasher

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    adminFactory = new AdminFactory(prisma)
    bcrypterHasher = new BcryptHasher()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PATCH] /token/refresh', async () => {
    const admin = await adminFactory.makePrismaAdmin({
      passwordHash: await bcrypterHasher.hash('123456'),
    })

    const authResponse = await supertest(app.server).post('/sessions').send({
      email: admin.email,
      password: '123456',
    })

    const cookies = authResponse.get('Set-Cookie')

    const response = await supertest(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      accessToken: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
