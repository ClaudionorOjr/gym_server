import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { EditAdminUseCase } from './edit-admin'
import { makeAdmin } from 'test/factories/make-admin'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

let adminsRepository: InMemoryAdminsRepository
let sut: EditAdminUseCase

describe('Edit admin use case', () => {
  beforeEach(() => {
    adminsRepository = new InMemoryAdminsRepository()
    sut = new EditAdminUseCase(adminsRepository)
  })

  it('should be able to edit an admin data', async () => {
    await adminsRepository.create(makeAdmin({}, 'admin-01'))

    const result = await sut.execute({
      adminId: 'admin-01',
      completeName: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(00) 98765-4321',
    })

    expect(result.isSuccess()).toBe(true)
    expect(adminsRepository.admins[0]).toMatchObject({
      completeName: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(00) 98765-4321',
    })
  })

  it('should not be able to edit an admin that does not exist', async () => {
    const result = await sut.execute({
      adminId: 'admin-01',
      completeName: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(00) 98765-4321',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
