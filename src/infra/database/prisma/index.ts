import { PrismaClient } from '@prisma/client'
import { DatabaseProvider } from '../database-provider'
import { injectable } from 'tsyringe'
import { env } from '@infra/env'

@injectable()
export class PrismaService extends PrismaClient implements DatabaseProvider {
  constructor() {
    super({
      log:
        env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
    })
  }

  onModuleInit() {
    return this.$connect()
  }

  onModuleDestroy() {
    return this.$disconnect()
  }
}
