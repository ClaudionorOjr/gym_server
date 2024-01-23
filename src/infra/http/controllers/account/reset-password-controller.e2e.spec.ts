import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { AdminFactory } from 'test/factories/make-admin'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'
import request from 'supertest'

describe('Reset password (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let jwtEncrypter: JwtEncrypter
  let bcrypterHasher: BcryptHasher

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    adminFactory = new AdminFactory(prisma)
    bcrypterHasher = new BcryptHasher()
    jwtEncrypter = new JwtEncrypter()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PUT] /reset-password', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const token = await jwtEncrypter.encrypt({ sub: admin.id }, '1h')

    // const invalid =
    //   'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0YjM4NTYxNC1lMDA0LTQ1ZTgtODcxMi01YjY5YjE0ZWFlMWEiLCJpYXQiOjE3MDU4NjcyNjQsImV4cCI6MTcwNTg3MDg2NH0.JzXt4nDNITWYy_fxEhJjNncPFrM5nrgIAdkDYZTdYhJFo8t5oehQJjZovrD2uGUSJJC6zpEMf5i-sD0bpOjXVIPqPdH56tuAQ3o_ZjG3NxHbpcnVvWHrjYUz6m5XLcLMs1mxutlo63FLqXdt4nDLKnVEsky-a4CY3QQci1MolU73ODslTLPXOVyw9XOtejEKnxoR0xDNKS13IUqAur8jhgyCKu_GoY192kG1_IRNe1aV91SFFFiNnFH4HpkzX6llHf3QO-8L3wWSDFIUehM7_zVyyuOPoWXsPlhFATY93ISpgy9my16vgcqd9zfCArbJFHp3pKpzQDsBp1JZ39Fk8w'

    const response = await request(app.server)
      .put('/reset-password')
      .query({ token })
      .send({
        password: '123456',
      })

    expect(response.statusCode).toEqual(204)

    const adminOnDatabase = await prisma.admin.findUniqueOrThrow({
      where: {
        id: admin.id,
      },
    })

    expect(
      await bcrypterHasher.compare('123456', adminOnDatabase.passwordHash),
    ).toBeTruthy()
  })
})
