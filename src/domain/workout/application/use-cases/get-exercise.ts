import { Either, failure, success } from '@core/either'
import { Exercise } from '@workout/enterprise/entities/exercise'
import { ExercisesRepository } from '../repositories/exercises-repository'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { inject, injectable } from 'tsyringe'

interface GetExerciseUseCaseRequest {
  exerciseId: string
}

type GetExerciseUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    exercise: Exercise
  }
>

@injectable()
export class GetExerciseUseCase {
  constructor(
    @inject('ExercisesRepository')
    private exercisesRepository: ExercisesRepository,
  ) {}

  async execute({
    exerciseId,
  }: GetExerciseUseCaseRequest): Promise<GetExerciseUseCaseResponse> {
    const exercise = await this.exercisesRepository.findById(exerciseId)

    if (!exercise) {
      return failure(new ResourceNotFoundError())
    }

    return success({ exercise })
  }
}
