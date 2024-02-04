import { FastifyInstance } from 'fastify'
import { PrismaService } from '@infra/database/prisma'
import { AdminFactory } from './factories/make-admin'
import { AdminProps } from '@account/enterprise/entities/admin'
import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'
import request from 'supertest'

interface Response {
  accessToken: string
}

/**
 * Creates and authenticates a user for e2e tests.
 *
 * @param {FastifyInstance} app - The Fastify application instance
 * @param {PrismaService} prisma - The Prisma service instance
 * @return {Object} - An object containing the access token
 */
export async function createAuthenticateUser(
  app: FastifyInstance,
  prisma: PrismaService,
  adminData: Partial<AdminProps> = {},
): Promise<Response> {
  const adminFactory = new AdminFactory(prisma)
  const hasher = new BcryptHasher()

  const admin = await adminFactory.makePrismaAdmin({
    ...adminData,
    passwordHash: await hasher.hash(adminData.passwordHash ?? '123456'),
  })

  const authResponse = await request(app.server)
    .post('/sessions')
    .send({
      email: admin.email,
      password: adminData.passwordHash ?? '123456',
    })

  const { accessToken } = authResponse.body

  return { accessToken }
}
