import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { AdminsRepository } from '../repositories/admins-repository'
import { Either, failure, success } from '@core/either'
import { inject, injectable } from 'tsyringe'

interface EditAdminUseCaseRequest {
  adminId: string
  completeName?: string
  email?: string
  phone?: string
}

type EditAdminUseCaseResponse = Either<ResourceNotFoundError, object>

@injectable()
export class EditAdminUseCase {
  constructor(
    @inject('AdminsRepository') private adminsRepository: AdminsRepository,
  ) {}

  async execute({
    adminId,
    completeName,
    email,
    phone,
  }: EditAdminUseCaseRequest): Promise<EditAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return failure(new ResourceNotFoundError())
    }

    admin.completeName = completeName ?? admin.completeName
    admin.email = email ?? admin.email
    admin.phone = phone ?? admin.phone

    await this.adminsRepository.save(admin)

    return success({})
  }
}
