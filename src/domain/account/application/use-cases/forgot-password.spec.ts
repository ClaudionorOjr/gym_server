import 'reflect-metadata'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { ForgotPasswordUseCase } from './forgot-password'
import { InMemoryMailProvider } from 'test/services/in-memory-mail-provider'
import { makeAdmin } from 'test/factories/make-admin'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { vi } from 'vitest'

describe('Forgot password use case', () => {
  let adminsRepository: InMemoryAdminsRepository
  let mailProvider: InMemoryMailProvider
  let fakeEncrypter: FakeEncrypter
  let sut: ForgotPasswordUseCase

  beforeEach(() => {
    adminsRepository = new InMemoryAdminsRepository()
    mailProvider = new InMemoryMailProvider()
    fakeEncrypter = new FakeEncrypter()
    sut = new ForgotPasswordUseCase(
      adminsRepository,
      mailProvider,
      fakeEncrypter,
    )
  })

  it('should be able to send an email to recover password', async () => {
    const sendMail = vi.spyOn(mailProvider, 'sendMail')
    const generetedToken = vi.spyOn(fakeEncrypter, 'encrypt')

    const email = 'johndoe@example.com'

    await adminsRepository.create(makeAdmin({ email }))
    const result = await sut.execute({
      email,
    })

    expect(result.isSuccess()).toBe(true)
    expect(sendMail).toHaveBeenCalled()
    expect(generetedToken).toHaveBeenCalled()
    expect(mailProvider.message).toHaveLength(1)
    expect(mailProvider.message[0].to).toEqual('johndoe@example.com')
  })

  it('should not be able to send an email to recover password with wrong email', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
