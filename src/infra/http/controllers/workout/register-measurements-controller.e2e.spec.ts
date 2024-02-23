import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { CustomerFactory } from 'test/factories/make-customer'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import request from 'supertest'

describe('Register measurements (e2e)', () => {
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

  test('[POST] /customers/:customerId/measurements', async () => {
    const customer = await customerFactory.makePrismaCustomer()

    const { accessToken } = await createAuthenticateUser(app, prisma)

    const response = await request(app.server)
      .post(`/customers/${customer.id}/measurements`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        bust: 80,
        biceps: 20,
        forearm: 15,
        waist: 70,
        hips: 80,
        thigh: 40,
        calf: 25,
      })

    expect(response.statusCode).toEqual(201)

    const measurmentsOnDatabase = await prisma.measurements.findFirst({
      where: {
        customerId: customer.id,
      },
    })

    expect(measurmentsOnDatabase).toBeTruthy()
  })
})
