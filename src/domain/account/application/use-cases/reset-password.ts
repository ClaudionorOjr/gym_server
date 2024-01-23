import { inject, injectable } from 'tsyringe'
import { Either, failure, success } from '@core/either'
import { AdminsRepository } from '../repositories/admins-repository'
import { Hasher } from '@account/cryptography/hasher'
import { Encrypter } from '@account/cryptography/encrypter'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

interface ResetPasswordUseCaseRequest {
  token: string
  password: string
}

type ResetPasswordUseCaseResponse = Either<
  unknown | ResourceNotFoundError,
  object
>

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject('AdminsRepository') private adminsRepository: AdminsRepository,
    @inject('Encrypter') private encrypter: Encrypter,
    @inject('Hasher') private hasher: Hasher,
  ) {}

  async execute({
    token,
    password,
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    try {
      const { sub: adminId } = await this.encrypter.verify(token)

      const admin = await this.adminsRepository.findById(adminId as string)

      console.log(admin)
      if (!admin) {
        return failure(new ResourceNotFoundError())
      }

      admin.passwordHash = await this.hasher.hash(password)

      await this.adminsRepository.save(admin)

      return success({})
    } catch (error) {
      return failure(error)

      // const err = error as Error
      // return failure(new TokenError(err.message))
    }
  }
}
