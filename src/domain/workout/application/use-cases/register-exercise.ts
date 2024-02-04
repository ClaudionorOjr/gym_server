import { Either, failure, success } from '@core/either'
import { Exercise } from '@workout/enterprise/entities/exercise'
import { ExercisesRepository } from '../repositories/exercises-repository'
import { MusculaturesRepository } from '../repositories/musculatures-repository'
import { ResourceAlreadyExistsError } from '@core/errors/resource-already-exists-error'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { inject, injectable } from 'tsyringe'

interface RegisterExerciseUseCaseRequest {
  name: string
  musculatureId: string
  equipment?: string
}

type RegisterExerciseUseCaseResponse = Either<
  ResourceAlreadyExistsError | ResourceNotFoundError,
  object
>

@injectable()
export class RegisterExerciseUseCase {
  constructor(
    @inject('ExercisesRepository')
    private exercisesRepository: ExercisesRepository,
    @inject('MusculaturesRepository')
    private musculaturesRepository: MusculaturesRepository,
  ) {}

  async execute({
    name,
    musculatureId,
    equipment,
  }: RegisterExerciseUseCaseRequest): Promise<RegisterExerciseUseCaseResponse> {
    const exerciseAlreadyExists =
      await this.exercisesRepository.findByName(name)

    if (exerciseAlreadyExists) {
      return failure(new ResourceAlreadyExistsError())
    }

    const musculature =
      await this.musculaturesRepository.findById(musculatureId)

    if (!musculature) {
      return failure(new ResourceNotFoundError())
    }

    const exercise = Exercise.create({
      name,
      musculatureId,
      equipment,
    })

    await this.exercisesRepository.create(exercise)

    return success({})
  }
}
