import { Either, failure, success } from '@core/either'
import { Musculature } from '@workout/enterprise/entities/musculature'
import { MusculaturesRepository } from '../repositories/musculatures-repository'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

interface GetMusculatureUseCaseRequest {
  musculatureId: string
}

type GetMusculatureUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    musculature: Musculature
  }
>

export class GetMusculatureUseCase {
  constructor(private musculaturesRepository: MusculaturesRepository) {}

  async execute({
    musculatureId,
  }: GetMusculatureUseCaseRequest): Promise<GetMusculatureUseCaseResponse> {
    const musculature =
      await this.musculaturesRepository.findById(musculatureId)

    if (!musculature) {
      return failure(new ResourceNotFoundError())
    }

    return success({ musculature })
  }
}
