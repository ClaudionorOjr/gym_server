import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'
import { AdminFactory } from 'test/factories/make-admin'
import request from 'supertest'

describe('Authenticate (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let bcryptHasher: BcryptHasher
  let adminFactory: AdminFactory

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    bcryptHasher = new BcryptHasher()
    adminFactory = new AdminFactory(prisma)

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /sessions', async () => {
    await adminFactory.makePrismaAdmin({
      email: 'johndoe@example.com',
      passwordHash: await bcryptHasher.hash('123456'),
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ accessToken: expect.any(String) })
  })
})
