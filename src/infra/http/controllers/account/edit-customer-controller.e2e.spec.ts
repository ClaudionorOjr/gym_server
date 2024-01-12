import 'reflect-metadata'
import { PrismaService } from '@infra/database/prisma'
import { FastifyInstance } from 'fastify'
import { CustomerFactory } from 'test/factories/make-customer'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import { AdminFactory } from 'test/factories/make-admin'
import request from 'supertest'

describe('Edit customer (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let customerFactory: CustomerFactory
  let adminFactory: AdminFactory
  let jwtEncrypter: JwtEncrypter

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    customerFactory = new CustomerFactory(prisma)
    adminFactory = new AdminFactory(prisma)
    jwtEncrypter = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PUT] /customer/:customerId', async () => {
    const customer = await customerFactory.makePrismaCustomer()
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = await jwtEncrypter.encrypt({ sub: admin.id })

    const response = await request(app.server)
      .put(`/customer/${customer.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        completeName: 'John Doe',
        email: 'johndoe@example.com',
        phone: '(00) 987654321',
        birthdate: '02/05/1995',
        paymentDay: '06',
      })

    expect(response.statusCode).toEqual(204)

    const updatedCustomer = await prisma.customer.findUnique({
      where: {
        id: customer.id,
      },
    })

    console.log(updatedCustomer)
    expect(updatedCustomer).toBeTruthy()
  })
})
