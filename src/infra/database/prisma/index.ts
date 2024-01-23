import { PrismaClient } from '@prisma/client'
import { DatabaseProvider } from '../database-provider'
import { injectable } from 'tsyringe'

@injectable()
export class PrismaService extends PrismaClient implements DatabaseProvider {
  constructor() {
    super({
      log: ['query', 'warn', 'error'],
    })
  }

  onModuleInit() {
    return this.$connect()
  }

  onModuleDestroy() {
    return this.$disconnect()
  }
}
