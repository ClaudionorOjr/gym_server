import { Either, success } from '@core/either'
import { ExercisesRepository } from '../repositories/exercises-repository'
import { Exercise } from '@workout/enterprise/entities/exercise'

type FetchExercisesUseCaseResponse = Either<
  null,
  {
    exercises: Exercise[]
  }
>

export class FetchExercisesUseCase {
  constructor(private exercisesRepository: ExercisesRepository) {}

  async execute(): Promise<FetchExercisesUseCaseResponse> {
    const exercises = await this.exercisesRepository.findMany()

    return success({ exercises })
  }
}
