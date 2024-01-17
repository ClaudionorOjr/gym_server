import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { AdminFactory } from 'test/factories/make-admin'
import { CustomerFactory } from 'test/factories/make-customer'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import request from 'supertest'

describe('Register measurements (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let customerFactory: CustomerFactory
  let jwtEncrypter: JwtEncrypter

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    adminFactory = new AdminFactory(prisma)
    customerFactory = new CustomerFactory(prisma)
    jwtEncrypter = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /customers/:customerId/measurements', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const customer = await customerFactory.makePrismaCustomer()

    const accessToken = await jwtEncrypter.encrypt({ sub: admin.id })

    const response = await request(app.server)
      .post(`/customers/${customer.id}/measurements`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        bust: 80,
        bicep: 20,
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
