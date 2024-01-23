import 'reflect-metadata'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { ResetPasswordUseCase } from './reset-password'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeAdmin } from 'test/factories/make-admin'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

let adminsRepository: InMemoryAdminsRepository
let fakeEncrypter: FakeEncrypter
let fakeHasher: FakeHasher
let sut: ResetPasswordUseCase

describe('Reset password use case', () => {
  beforeEach(() => {
    adminsRepository = new InMemoryAdminsRepository()
    fakeEncrypter = new FakeEncrypter()
    fakeHasher = new FakeHasher()
    sut = new ResetPasswordUseCase(adminsRepository, fakeEncrypter, fakeHasher)
  })

  it('should be able to reset password', async () => {
    await adminsRepository.create(
      makeAdmin(
        {
          passwordHash: await fakeHasher.hash('123456'),
        },
        'admin-01',
      ),
    )
    const token = await fakeEncrypter.encrypt({ sub: 'admin-01' })

    console.log(token)

    const result = await sut.execute({
      token,
      password: '123123',
    })

    expect(result.isSuccess()).toBe(true)

    const newPasswordHashed = await fakeHasher.hash('123123')
    expect(adminsRepository.admins[0].passwordHash).toEqual(newPasswordHashed)
  })

  it('should not be able to reset password of an admin that does not exist', async () => {
    const token = await fakeEncrypter.encrypt({ sub: 'admin-01' })

    const result = await sut.execute({
      token,
      password: '123123',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to reset password with wrong token', async () => {
    const result = await sut.execute({
      token: 'wrong-token',
      password: '123123',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(Error)
  })
})
