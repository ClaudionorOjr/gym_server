import 'reflect-metadata'
import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'
import { createAuthenticateUser } from 'test/create-authenticate-user'
import request from 'supertest'

describe('Change password (e2e)', () => {
  let app: FastifyInstance
  let prisma: PrismaService
  let bcrypterHasher: BcryptHasher

  beforeAll(async () => {
    app = (await import('src/app')).app
    prisma = new PrismaService()
    bcrypterHasher = new BcryptHasher()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PUT] /change-password', async () => {
    const { accessToken } = await createAuthenticateUser(app, prisma, {
      passwordHash: '123457',
    })

    const response = await request(app.server)
      .put('/change-password')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: '123457',
        newPassword: '654321',
      })

    expect(response.statusCode).toEqual(204)

    const { passwordHash } = await prisma.admin.findFirstOrThrow({
      select: {
        passwordHash: true,
      },
    })
    expect(await bcrypterHasher.compare('654321', passwordHash)).toBeTruthy()
  })
})
