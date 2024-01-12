import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { AdminFactory } from 'test/factories/make-admin'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import request from 'supertest'

describe('Register customer (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let jwtEncrypter: JwtEncrypter

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    jwtEncrypter = new JwtEncrypter()
    adminFactory = new AdminFactory(prisma)

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /customer/register', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = await jwtEncrypter.encrypt({ sub: admin.id })

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

    console.log(customerOnDatabase)
    expect(customerOnDatabase).toBeTruthy()
  })
})
