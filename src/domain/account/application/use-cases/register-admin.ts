import { Either, failure, success } from '@core/either'
import { Admin } from '../../enterprise/entities/admin'
import { AdminsRepository } from '../repositories/admins-repository'
import { Hasher } from '@account/cryptography/hasher'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterAdminUseCaseRequest {
  completeName: string
  email: string
  password: string
  phone: string
}

type RegisterAdminUseCaseResponse = Either<UserAlreadyExistsError, object>

export class RegisterAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
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
