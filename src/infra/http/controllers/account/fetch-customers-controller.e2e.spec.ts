import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { AdminFactory } from 'test/factories/make-admin'
import { CustomerFactory } from 'test/factories/make-customer'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import request from 'supertest'

describe('Fetch customer (e2e)', () => {
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

  test('[GET] /customers', async () => {
    await Promise.all([
      customerFactory.makePrismaCustomer(),
      customerFactory.makePrismaCustomer(),
      customerFactory.makePrismaCustomer(),
    ])

    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = await jwtEncrypter.encrypt({ sub: admin.id })

    const response = await request(app.server)
      .get('/customers')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    console.log(response.body.customers)
    expect(response.statusCode).toEqual(200)
    expect(response.body.customers).toHaveLength(3)
  })
})
