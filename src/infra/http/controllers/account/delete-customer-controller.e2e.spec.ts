import 'reflect-metadata'
import { PrismaService } from '@infra/database/prisma'
import { FastifyInstance } from 'fastify'
import { CustomerFactory } from 'test/factories/make-customer'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import request from 'supertest'

describe('Delete customer (e2e)', () => {
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

  test('[DELETE] /customer/:customerId', async () => {
    const customer = await customerFactory.makePrismaCustomer()

    const { accessToken } = await createAuthenticateUser(app, prisma)

    const response = await request(app.server)
      .delete(`/customer/${customer.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(204)
  })
})
