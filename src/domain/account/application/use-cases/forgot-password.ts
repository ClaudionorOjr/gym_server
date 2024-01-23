import { inject, injectable } from 'tsyringe'
import { Either, failure, success } from '@core/either'
import { AdminsRepository } from '../repositories/admins-repository'
import { MailProvider } from '@infra/services/mail/mail-provider'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { resolve } from 'node:path'
import { env } from '@infra/env'
import { Encrypter } from '@account/cryptography/encrypter'

interface ForgotPasswordUseCaseRequest {
  email: string
}

type ForgotPasswordUseCaseResponse = Either<ResourceNotFoundError, object>

@injectable()
export class ForgotPasswordUseCase {
  constructor(
    @inject('AdminsRepository')
    private adminsRepository: AdminsRepository,
    @inject('MailProvider')
    private mailService: MailProvider,
    @inject('Encrypter')
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
  }: ForgotPasswordUseCaseRequest): Promise<ForgotPasswordUseCaseResponse> {
    const admin = await this.adminsRepository.findByEmail(email)

    if (!admin) {
      return failure(new ResourceNotFoundError())
    }

    const templatePath = resolve('./src/infra/http/views/forgot-password.hbs')

    const token = await this.encrypter.encrypt({ sub: admin.id }, '1h')

    const variables = {
      name: admin.completeName,
      link: `${env.MAIL_URL_FORGOT_PASSWORD}?token=${token}`,
    }

    console.log(variables.link)

    await this.mailService.sendMail({
      to: email,
      subject: 'Recuperação de senha',
      variables,
      path: templatePath,
    })

    return success({})
  }
}
