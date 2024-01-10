import { Either, failure, success } from '@core/either'
import { Admin } from '../../enterprise/entities/admin'
import { AdminsRepository } from '../repositories/admins-repository'
import { Hasher } from '@account/cryptography/hasher'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { inject, injectable } from 'tsyringe'

interface RegisterAdminUseCaseRequest {
  completeName: string
  email: string
  password: string
  phone: string
}

type RegisterAdminUseCaseResponse = Either<UserAlreadyExistsError, object>

@injectable()
export class RegisterAdminUseCase {
  constructor(
    @inject('AdminsRepository')
    private adminsRepository: AdminsRepository,
    @inject('Hasher')
    private hasher: Hasher,
  ) {}

  async execute({
    completeName,
    email,
    password,
    phone,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const adminAlreadyExists = await this.adminsRepository.findByEmail(email)

    if (adminAlreadyExists) {
      return failure(new UserAlreadyExistsError())
    }

    const passwordHash = await this.hasher.hash(password)

    const admin = Admin.create({
      completeName,
      email,
      passwordHash,
      phone,
    })

    await this.adminsRepository.create(admin)

    return success({})
  }
}
