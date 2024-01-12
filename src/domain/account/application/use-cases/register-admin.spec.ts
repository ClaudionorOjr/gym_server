import 'reflect-metadata'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { RegisterAdminUseCase } from './register-admin'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeAdmin } from 'test/factories/make-admin'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let adminsRepository: InMemoryAdminsRepository
let fakeHasher: FakeHasher
let sut: RegisterAdminUseCase

describe('Register admin use case', () => {
  beforeEach(() => {
    adminsRepository = new InMemoryAdminsRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterAdminUseCase(adminsRepository, fakeHasher)
  })

  it('should be able to register a admin', async () => {
    const result = await sut.execute({
      completeName: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '(00) 98765-4321',
    })

    expect(result.isSuccess()).toBe(true)
    expect(adminsRepository.admins).toHaveLength(1)
  })

  it('should hash the password upon register', async () => {
    await sut.execute({
      completeName: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '(00) 98765-4321',
    })

    const adminPassword = adminsRepository.admins[0].passwordHash

    const isPasswordCorrectlyHashed = await fakeHasher.compare(
      '123456',
      adminPassword,
    )

    expect(isPasswordCorrectlyHashed).toBeTruthy()
  })

  it('should not be able to register an admin with an existing email', async () => {
    await adminsRepository.create(makeAdmin({ email: 'johndoe@example.com' }))

    const result = await sut.execute({
      completeName: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '(00) 98765-4321',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})
