import { Either, failure, success } from '@core/either'
import { MusculaturesRepository } from '../repositories/musculatures-repository'
import { ResourceAlreadyExistsError } from '@core/errors/resource-already-exists-error'
import { Musculature } from '@workout/enterprise/entities/musculature'
import { inject, injectable } from 'tsyringe'

interface RegisterMusculatureUseCaseRequest {
  name: string
}

type RegisterMusculatureUseCaseResponse = Either<
  ResourceAlreadyExistsError,
  object
>

@injectable()
export class RegisterMusculatureUseCase {
  constructor(
    @inject('MusculaturesRepository')
    private musculaturesRepository: MusculaturesRepository,
  ) {}

  async execute({
    name,
  }: RegisterMusculatureUseCaseRequest): Promise<RegisterMusculatureUseCaseResponse> {
    const musculatureAlreadyExists =
      await this.musculaturesRepository.findByName(name)

    if (musculatureAlreadyExists) {
      return failure(new ResourceAlreadyExistsError())
    }

    const musculature = Musculature.create({
      name,
    })

    await this.musculaturesRepository.create(musculature)

    return success({})
  }
}
