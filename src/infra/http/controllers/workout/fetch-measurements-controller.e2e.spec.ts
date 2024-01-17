import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { AdminFactory } from 'test/factories/make-admin'
import { CustomerFactory } from 'test/factories/make-customer'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import { MeasurementsFactory } from 'test/factories/make-measurements'
import request from 'supertest'

describe('Fetch measurements (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let customerFactory: CustomerFactory
  let measurementsFactory: MeasurementsFactory
  let jwtEncrypter: JwtEncrypter

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    adminFactory = new AdminFactory(prisma)
    customerFactory = new CustomerFactory(prisma)
    measurementsFactory = new MeasurementsFactory(prisma)
    jwtEncrypter = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /customers/:customerId/measurements', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const customer = await customerFactory.makePrismaCustomer()

    await Promise.all([
      measurementsFactory.makePrismaMeasurements({ customerId: customer.id }),
      measurementsFactory.makePrismaMeasurements({ customerId: customer.id }),
    ])

    const accessToken = await jwtEncrypter.encrypt({ sub: admin.id })

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
