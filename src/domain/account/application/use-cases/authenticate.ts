import { Either, failure, success } from '@core/either'
import { AdminsRepository } from '../repositories/admins-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { Hasher } from '@account/cryptography/hasher'
import { Encrypter } from '@account/cryptography/encrypter'
import { inject, injectable } from 'tsyringe'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@injectable()
export class AuthenticateUseCase {
  constructor(
    @inject('AdminsRepository')
    private adminsRepository: AdminsRepository,
    @inject('Hasher')
    private hasher: Hasher,
    @inject('Encrypter')
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const admin = await this.adminsRepository.findByEmail(email)

    if (!admin) {
      return failure(new WrongCredentialsError())
    }

    const doesPasswordMatch = await this.hasher.compare(
      password,
      admin.passwordHash,
    )

    if (!doesPasswordMatch) {
      return failure(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({ sub: admin.id })

    return success({ accessToken })
  }
}
