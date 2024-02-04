import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { CustomerFactory } from 'test/factories/make-customer'
import { MeasurementsFactory } from 'test/factories/make-measurements'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import request from 'supertest'

describe('Get measurments (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let customerFactory: CustomerFactory
  let measurementsFactory: MeasurementsFactory

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    customerFactory = new CustomerFactory(prisma)
    measurementsFactory = new MeasurementsFactory(prisma)

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('[GET] /customers/measurements/:measurementsId', async () => {
    const customer = await customerFactory.makePrismaCustomer()
    const measurements = await measurementsFactory.makePrismaMeasurements({
      customerId: customer.id,
    })

    const { accessToken } = await createAuthenticateUser(app, prisma)

    const result = await request(app.server)
      .get(`/customers/measurements/${measurements.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(result.statusCode).toEqual(200)
  })
})
