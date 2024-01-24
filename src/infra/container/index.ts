import { container } from 'tsyringe'

import './providers/mail-provider/index'

import { DatabaseProvider } from '../database/database-provider'
import { PrismaService } from '../database/prisma'

import { Hasher } from '@account/cryptography/hasher'
import { BcryptHasher } from '@infra/cryptography/bcrypt-hasher'

import { Encrypter } from '@account/cryptography/encrypter'
import { JwtEncrypter } from '@infra/cryptography/jwt-encrypter'

import { AdminsRepository } from '@account/application/repositories/admins-repository'
import { PrismaAdminsRepository } from '../database/prisma/repositories/prisma-admins-repository'

import { CustomersRepository } from '@account/application/repositories/customers-repository'
import { PrismaCustomersRepository } from '@infra/database/prisma/repositories/prisma-customers-repository'

import { MeasurementsRepository } from '@workout/application/repositories/measurements-repository'
import { PrismaMeasurementsRepository } from '@infra/database/prisma/repositories/prisma-measurements-repository'

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

container.registerSingleton<MeasurementsRepository>(
  'MeasurementsRepository',
  PrismaMeasurementsRepository,
)
