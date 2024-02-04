import { Either, success } from '@core/either'
import { ExercisesRepository } from '../repositories/exercises-repository'
import { Exercise } from '@workout/enterprise/entities/exercise'
import { inject, injectable } from 'tsyringe'

type FetchExercisesUseCaseResponse = Either<
  null,
  {
    exercises: Exercise[]
  }
>

@injectable()
export class FetchExercisesUseCase {
  constructor(
    @inject('ExercisesRepository')
    private exercisesRepository: ExercisesRepository,
  ) {}

  async execute(): Promise<FetchExercisesUseCaseResponse> {
    const exercises = await this.exercisesRepository.findMany()

    return success({ exercises })
  }
}
