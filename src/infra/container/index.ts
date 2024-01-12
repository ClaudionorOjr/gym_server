import { container } from 'tsyringe'

import { DatabaseProvider } from '../database/database-provider'
import { PrismaService } from '../database/prisma'

import { Hasher } from '@account/cryptography/hasher'
import { BcryptHasher } from '../cryptography/bcrypt-hasher'

import { AdminsRepository } from '@account/application/repositories/admins-repository'
import { PrismaAdminsRepository } from '../database/prisma/repositories/prisma-admins-repository'

import { CustomersRepository } from '@account/application/repositories/customers-repository'
import { PrismaCustomersRepository } from '@infra/database/prisma/repositories/prisma-customers-repository'
import { Encrypter } from '@account/cryptography/encrypter'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'

container.registerSingleton<DatabaseProvider>('Prisma', PrismaService)

container.registerSingleton<Hasher>('Hasher', BcryptHasher)

container.registerSingleton<Encrypter>('Encrypter', JwtEncrypter)

container.registerSingleton<AdminsRepository>(
  'AdminsRepository',
  PrismaAdminsRepository,
)

container.registerSingleton<CustomersRepository>(
  'CustomersRepository',
  PrismaCustomersRepository,
)
