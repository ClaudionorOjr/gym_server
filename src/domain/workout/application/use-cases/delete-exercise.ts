import { Either, failure, success } from '@core/either'
import { ExercisesRepository } from '../repositories/exercises-repository'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

interface DeleteExerciseUseCaseRequest {
  exerciseId: string
}
type DeleteExerciseUseCaseResponse = Either<ResourceNotFoundError, object>

export class DeleteExerciseUseCase {
  constructor(private exercisesRepository: ExercisesRepository) {}

  async execute({
    exerciseId,
  }: DeleteExerciseUseCaseRequest): Promise<DeleteExerciseUseCaseResponse> {
    const exercise = await this.exercisesRepository.findById(exerciseId)

    if (!exercise) {
      return failure(new ResourceNotFoundError())
    }

    await this.exercisesRepository.delete(exerciseId)

    return success({})
  }
}
