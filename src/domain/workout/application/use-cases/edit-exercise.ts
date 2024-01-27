import { Either, failure, success } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { ExercisesRepository } from '../repositories/exercises-repository'
import { MusculaturesRepository } from '../repositories/musculatures-repository'

interface EditExerciseUseCaseRequest {
  exerciseId: string
  name?: string
  musculatureId?: string
  equipment?: string
}

type EditExerciseUseCaseResponse = Either<ResourceNotFoundError, object>

export class EditExerciseUseCase {
  constructor(
    private exercisesRepository: ExercisesRepository,
    private musculaturesRepository: MusculaturesRepository,
  ) {}

  async execute({
    exerciseId,
    name,
    musculatureId,
    equipment,
  }: EditExerciseUseCaseRequest): Promise<EditExerciseUseCaseResponse> {
    const exercise = await this.exercisesRepository.findById(exerciseId)

    if (!exercise) {
      return failure(new ResourceNotFoundError())
    }

    exercise.name = name ?? exercise.name
    exercise.equipment = equipment ?? exercise.equipment

    if (musculatureId) {
      const musculature =
        await this.musculaturesRepository.findById(musculatureId)

      if (!musculature) {
        return failure(new ResourceNotFoundError())
      }

      exercise.musculatureId = musculatureId
    }

    return success({})
  }
}
