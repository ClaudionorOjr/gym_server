import { Either, failure, success } from '@core/either'
import { AdminsRepository } from '../repositories/admins-repository'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { Hasher } from '@account/cryptography/hasher'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface ChangePasswordUseCaseRequest {
  adminId: string
  password: string
  newPassword: string
}

type ChangePasswordUseCaseResponse = Either<
  ResourceNotFoundError | WrongCredentialsError,
  object
>

export class ChangePasswordUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hasher: Hasher,
  ) {}

  async execute({
    adminId,
    password,
    newPassword,
  }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return failure(new ResourceNotFoundError())
    }

    const doesPasswordMatch = await this.hasher.compare(
      password,
      admin.passwordHash,
    )

    if (!doesPasswordMatch) {
      return failure(new WrongCredentialsError())
    }

    const newPasswordHash = await this.hasher.hash(newPassword)

    admin.passwordHash = newPasswordHash

    await this.adminsRepository.save(admin)

    return success({})
  }
}
