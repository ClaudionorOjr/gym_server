import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from 'src/infra/database/prisma'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import request from 'supertest'

describe('Register admin (e2e)', () => {
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

  test('[POST] admin/register', async () => {
    const { accessToken } = await createAuthenticateUser(app, prisma)

    const response = await request(app.server)
      .post('/admin/register')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        completeName: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        phone: '(00) 98765-4321',
      })

    expect(response.statusCode).toEqual(201)

    const adminOnDatabase = await prisma.admin.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    })

    expect(adminOnDatabase).toBeTruthy()
  })
})
