import { inject, injectable } from 'tsyringe'
import { Either, success } from '@core/either'
import { MusculaturesRepository } from '../repositories/musculatures-repository'
import { Musculature } from '@workout/enterprise/entities/musculature'

type FetchMusculaturesUseCaseResponse = Either<
  null,
  {
    musculatures: Musculature[]
  }
>

@injectable()
export class FetchMusculaturesUseCase {
  constructor(
    @inject('MusculaturesRepository')
    private musculaturesRepository: MusculaturesRepository,
  ) {}

  async execute(): Promise<FetchMusculaturesUseCaseResponse> {
    const musculatures = await this.musculaturesRepository.findMany()

    return success({ musculatures })
  }
}
