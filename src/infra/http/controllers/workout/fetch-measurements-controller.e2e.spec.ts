import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { CustomerFactory } from 'test/factories/make-customer'
import { MeasurementsFactory } from 'test/factories/make-measurements'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import request from 'supertest'

describe('Fetch measurements (e2e)', () => {
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

  test('[GET] /customers/:customerId/measurements', async () => {
    const customer = await customerFactory.makePrismaCustomer()

    await Promise.all([
      measurementsFactory.makePrismaMeasurements({ customerId: customer.id }),
      measurementsFactory.makePrismaMeasurements({ customerId: customer.id }),
    ])

    const { accessToken } = await createAuthenticateUser(app, prisma)

    const response = await request(app.server)
      .get(`/customers/${customer.id}/measurements`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)

    const measurementsOnDatabase = await prisma.measurements.findMany({
      where: {
        customerId: customer.id,
      },
    })

    expect(measurementsOnDatabase).toHaveLength(2)
  })
})
