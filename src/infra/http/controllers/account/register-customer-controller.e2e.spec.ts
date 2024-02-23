import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import request from 'supertest'

describe('Register customer (e2e)', () => {
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

  test('[POST] /customer/register', async () => {
    const { accessToken } = await createAuthenticateUser(app, prisma)

    const response = await request(app.server)
      .post('/customer/register')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        completeName: 'John Doe',
        email: 'johndoe@example.com',
        phone: '(00) 98765-4321',
        birthdate: '01/03/1990',
      })

    expect(response.statusCode).toEqual(201)

    const customerOnDatabase = await prisma.customer.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    })

    expect(customerOnDatabase).toBeTruthy()
  })
})
