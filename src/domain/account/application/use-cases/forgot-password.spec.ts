import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { ForgotPasswordUseCase } from './forgot-password'
import { InMemoryMailProvider } from 'test/services/in-memory-mail-provider'
import { makeAdmin } from 'test/factories/make-admin'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'

let adminsRepository: InMemoryAdminsRepository
let mailProvider: InMemoryMailProvider
let fakeEncrypter: FakeEncrypter
let sut: ForgotPasswordUseCase

describe('Forgot password use case', () => {
  beforeEach(() => {
    adminsRepository = new InMemoryAdminsRepository()
    mailProvider = new InMemoryMailProvider()
    sut = new ForgotPasswordUseCase(
      adminsRepository,
      mailProvider,
      fakeEncrypter,
    )
  })

  it('should be able to send an email to recover password', async () => {
    const email = 'johndoe@example.com'

    await adminsRepository.create(makeAdmin({ email }))
    const result = await sut.execute({
      email,
    })

    expect(result.isSuccess()).toBe(true)
    expect(mailProvider.message).toHaveLength(1)
    expect(mailProvider.message[0].to).toEqual('johndoe@example.com')
  })
})
