import 'reflect-metadata'
import { PrismaService } from '@infra/database/prisma'
import { FastifyInstance } from 'fastify'
import { CustomerFactory } from 'test/factories/make-customer'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import request from 'supertest'

describe('Edit customer (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let customerFactory: CustomerFactory

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    customerFactory = new CustomerFactory(prisma)

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PUT] /customer/:customerId', async () => {
    const customer = await customerFactory.makePrismaCustomer()

    const { accessToken } = await createAuthenticateUser(app, prisma)

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

    expect(updatedCustomer).toBeTruthy()
  })
})
