import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { ChangePasswordUseCase } from './change-password'
import { makeAdmin } from 'test/factories/make-admin'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let adminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let sut: ChangePasswordUseCase

describe('Change password use case', () => {
  beforeEach(() => {
    adminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    sut = new ChangePasswordUseCase(adminsRepository, fakeHasher)
  })

  it('should be able to change password', async () => {
    await adminsRepository.create(
      makeAdmin({ passwordHash: await fakeHasher.hash('123456') }, 'admin-01'),
    )

    const result = await sut.execute({
      adminId: 'admin-01',
      password: '123456',
      newPassword: '123123',
    })

    const newPasswordHash = await fakeHasher.hash('123123')

    expect(result.isSuccess()).toBe(true)
    expect(adminsRepository.admins[0].passwordHash).toEqual(newPasswordHash)
  })

  it('should not be able to change password of an admin that does not exist', async () => {
    const result = await sut.execute({
      adminId: 'admin-01',
      password: '123456',
      newPassword: '123123',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to change password with wrong password', async () => {
    await adminsRepository.create(
      makeAdmin({ passwordHash: await fakeHasher.hash('123456') }, 'admin-01'),
    )

    const result = await sut.execute({
      adminId: 'admin-01',
      password: '123457',
      newPassword: '123123',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
