import { Either, failure, success } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { MusculaturesRepository } from '../repositories/musculatures-repository'

interface DeleteMusculatureUseCaseRequest {
  musculatureId: string
}
type DeleteMusculatureUseCaseResponse = Either<ResourceNotFoundError, object>

export class DeleteMusculatureUseCase {
  constructor(private musculaturesRepository: MusculaturesRepository) {}

  async execute({
    musculatureId,
  }: DeleteMusculatureUseCaseRequest): Promise<DeleteMusculatureUseCaseResponse> {
    const musculature =
      await this.musculaturesRepository.findById(musculatureId)

    if (!musculature) {
      return failure(new ResourceNotFoundError())
    }

    await this.musculaturesRepository.delete(musculatureId)

    return success({})
  }
}
