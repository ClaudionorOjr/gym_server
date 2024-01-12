import 'reflect-metadata'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'
import { PrismaService } from '@infra/database/prisma'
import { FastifyInstance } from 'fastify'
import { AdminFactory } from 'test/factories/make-admin'
import request from 'supertest'
import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'

describe('Change password (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let bcrypterHasher: BcryptHasher
  let jwtEncrypter: JwtEncrypter

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

  test('[PUT] /change-password', async () => {
    const admin = await adminFactory.makePrismaAdmin({
      passwordHash: await bcrypterHasher.hash('123456'),
    })

    const accessToken = await jwtEncrypter.encrypt({ sub: admin.id })

    const response = await request(app.server)
      .put('/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: '123456',
        newPassword: '654321',
      })

    expect(response.statusCode).toEqual(204)

    const { passwordHash } = await prisma.admin.findUniqueOrThrow({
      where: {
        id: admin.id,
      },
      select: {
        passwordHash: true,
      },
    })
    expect(await bcrypterHasher.compare('654321', passwordHash)).toBeTruthy()
  })
})
