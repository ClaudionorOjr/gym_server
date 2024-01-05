import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { AuthenticateUseCase } from './authenticate'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeAdmin } from 'test/factories/make-admin'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let adminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    adminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateUseCase(adminsRepository, fakeHasher, fakeEncrypter)
  })

  it('should be able to authenticate', async () => {
    await adminsRepository.create(
      makeAdmin({
        email: 'johndoe@example.com',
        passwordHash: await fakeHasher.hash('123456'),
      }),
    )

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate with wrong email', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await adminsRepository.create(makeAdmin({ email: 'johndoe@example.com' }))

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
