import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { CustomerFactory } from 'test/factories/make-customer'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import request from 'supertest'

describe('Fetch customer (e2e)', () => {
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

  test('[GET] /customers', async () => {
    await Promise.all([
      customerFactory.makePrismaCustomer(),
      customerFactory.makePrismaCustomer(),
      customerFactory.makePrismaCustomer(),
    ])

    const { accessToken } = await createAuthenticateUser(app, prisma)

    const response = await request(app.server)
      .get('/customers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.customers).toHaveLength(3)
  })
})
